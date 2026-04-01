// --- Translations ---

let translations = {};
const LANG = "de"; // default display language

async function loadTranslations() {
	const res = await fetch("/api/nutrients/translations");
	translations = await res.json();
}

function t(standardName) {
	const entry = translations[standardName];
	if (entry && entry[LANG]) return entry[LANG];
	if (entry && entry.en) return entry.en;
	return standardName;
}

// --- Helpers ---

function esc(str) {
	if (!str) return "";
	const div = document.createElement("div");
	div.textContent = str;
	return div.innerHTML;
}

// --- DOM Elements ---

const productListEl = document.getElementById("product-list");
const productDetailEl = document.getElementById("product-detail");
const detailImage = document.getElementById("detail-image");
const detailFilename = document.getElementById("detail-filename");
const nutrientBody = document.querySelector("#nutrient-table tbody");
const uploadBtn = document.getElementById("upload-btn");
const backBtn = document.getElementById("back-btn");
const uploadDialog = document.getElementById("upload-dialog");
const uploadForm = document.getElementById("upload-form");
const uploadStatus = document.getElementById("upload-status");

// --- Navigation ---

const navTabs = document.querySelectorAll(".nav-tab");
const views = {
	products: document.getElementById("view-products"),
	nutrients: document.getElementById("view-nutrients"),
	units: document.getElementById("view-units"),
};

function switchView(viewName, updateHash = true) {
	navTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
	Object.entries(views).forEach(([name, el]) => el.classList.toggle("hidden", name !== viewName));

	if (viewName === "nutrients") loadNutrientDefinitions();
	if (viewName === "units") loadUnitDefinitions();
	if (viewName === "products") {
		productDetailEl.classList.add("hidden");
		productListEl.classList.remove("hidden");
	}

	if (updateHash && viewName !== "products") {
		history.pushState(null, "", `#${viewName}`);
	}
}

navTabs.forEach((tab) => {
	tab.addEventListener("click", () => {
		if (tab.dataset.view === "products") {
			history.pushState(null, "", "#");
		}
		switchView(tab.dataset.view);
	});
});

// --- Product List ---

function showList() {
	productListEl.classList.remove("hidden");
	productDetailEl.classList.add("hidden");
	history.pushState(null, "", "#");
}

function showDetail() {
	productListEl.classList.add("hidden");
	productDetailEl.classList.remove("hidden");
}

let productIds = [];

async function loadProducts() {
	const res = await fetch("/api/products");
	const products = await res.json();
	productIds = products.map((p) => p._id);
	renderProductList(products);
}

function getCardFlags(p) {
	const flags = [];
	const q = p.image_quality || {};
	if (q.is_ai_generated) flags.push('<span class="flag flag-ai">AI</span>');
	if (q.is_low_quality) flags.push('<span class="flag flag-low">LOW-Q</span>');
	if (q.is_unreadable) flags.push('<span class="flag flag-unreadable">UNREADABLE</span>');
	return flags.join(" ");
}

function getReviewBadge(status) {
	if (status === "approved") return '<span class="review-badge review-approved">Approved</span>';
	if (status === "flagged") return '<span class="review-badge review-flagged">Flagged</span>';
	if (status === "denied") return '<span class="review-badge review-denied">Denied</span>';
	return "";
}

function renderProductList(products) {
	productListEl.innerHTML = products
		.map(
			(p) => `
		<div class="product-card ${p.review_status || ""}" data-id="${p._id}">
			<div class="card-image-wrap">
				<img src="/api/products/${p._id}/image" alt="${esc(p.filename)}" loading="lazy">
				<div class="card-flags">${getCardFlags(p)}${getReviewBadge(p.review_status)}</div>
			</div>
			<div class="card-info">
				<div class="card-product-name">${esc(p.product_name || p.filename)}</div>
				${p.manufacturer ? `<div class="card-manufacturer">${esc(p.manufacturer)}</div>` : ""}
				<div class="card-count">${p.nutrients.length} nutrients</div>
			</div>
		</div>`
		)
		.join("");

	productListEl.querySelectorAll(".product-card").forEach((card) => {
		card.addEventListener("click", () => loadProduct(card.dataset.id));
	});
}

// --- Product Detail ---

async function loadProduct(id, updateHash = true) {
	const res = await fetch(`/api/products/${id}`);
	if (!res.ok) return;
	const product = await res.json();
	renderProductDetail(product);
	showDetail();
	if (updateHash) {
		history.pushState(null, "", `#product/${id}`);
	}
}

let currentProductId = null;

function renderProductDetail(product) {
	currentProductId = product._id;
	detailImage.src = `/api/products/${product._id}/image`;
	detailImage.alt = product.filename;
	detailFilename.textContent = product.product_name || product.filename;

	// Manufacturer
	const manufacturerEl = document.getElementById("detail-manufacturer");
	if (product.manufacturer) {
		manufacturerEl.textContent = product.manufacturer;
		manufacturerEl.classList.remove("hidden");
	} else {
		manufacturerEl.classList.add("hidden");
	}

	// Image quality warnings
	const qualityEl = document.getElementById("quality-warnings");
	const q = product.image_quality || {};
	const warnings = [];
	if (q.is_ai_generated) warnings.push("AI-generated image detected");
	if (q.is_low_quality) warnings.push("Low quality image");
	if (q.is_unreadable) warnings.push("Label unreadable");
	if (q.quality_notes && q.quality_notes !== "clean") warnings.push(q.quality_notes);

	if (warnings.length > 0) {
		qualityEl.innerHTML = warnings.map((w) => `<div class="quality-warning">${esc(w)}</div>`).join("");
		qualityEl.classList.remove("hidden");
	} else {
		qualityEl.classList.add("hidden");
	}

	// Review status buttons
	const reviewEl = document.getElementById("review-actions");
	const currentStatus = product.review_status || "pending";
	reviewEl.querySelectorAll(".review-btn").forEach((btn) => {
		btn.classList.toggle("active", btn.dataset.status === currentStatus);
	});

	// Serving size info
	const servingInfo = document.getElementById("serving-info");
	const servingSizeEl = document.getElementById("serving-size");
	const servingsContainerWrap = document.getElementById("servings-container-wrap");
	const servingsContainerEl = document.getElementById("servings-per-container");

	const ss = product.serving_size;
	if (ss) {
		servingSizeEl.textContent = ss.amount != null ? `${ss.amount} ${ss.unit}` : ss.raw;
		servingInfo.classList.remove("hidden");
	} else {
		servingInfo.classList.add("hidden");
	}

	if (product.servings_per_container) {
		servingsContainerEl.textContent = product.servings_per_container;
		servingsContainerWrap.classList.remove("hidden");
	} else {
		servingsContainerWrap.classList.add("hidden");
	}

	nutrientBody.innerHTML = product.nutrients
		.map(
			(n, i) => `
		<tr class="${n.matched === false ? "unmatched-row" : ""}">
			<td>
				<span class="nutrient-display-name">${esc(t(n.nutrient_name_standard))}</span>
				<span class="raw-name-hint">(${esc(n.nutrient_name_raw)})</span>
				${n.matched === false ? ' <span class="flag flag-unmatched">UNKNOWN</span>' : ""}
				<button class="btn-edit-nutrient" data-index="${i}" title="Change mapping">&#9998;</button>
			</td>
			<td class="amount-cell">${n.amount ?? "\u2014"}</td>
			<td class="unit-cell">${n.unit || ""}</td>
			<td class="amount-cell nrv-cell">${n.nrv_percent != null ? n.nrv_percent + "%" : "\u2014"}</td>
		</tr>`
		)
		.join("");

	// Edit nutrient mapping
	nutrientBody.querySelectorAll(".btn-edit-nutrient").forEach((btn) => {
		btn.addEventListener("click", () => openNutrientEditor(btn, product._id, parseInt(btn.dataset.index)));
	});

	// Raw JSON
	document.getElementById("raw-json").textContent = JSON.stringify(product, null, 2);

	updateNavButtons();
}

// --- Nutrient Editor ---

async function openNutrientEditor(btn, productId, nutrientIndex) {
	// Ensure definitions are loaded
	if (!cachedNutrients) {
		const res = await fetch("/api/nutrients");
		cachedNutrients = await res.json();
	}

	// Close any existing editor
	document.querySelectorAll(".nutrient-editor").forEach((el) => el.remove());

	const editor = document.createElement("div");
	editor.className = "nutrient-editor";
	editor.innerHTML = `
		<input type="text" class="nutrient-search" placeholder="Search nutrient..." autofocus>
		<div class="nutrient-search-results"></div>
	`;

	btn.closest("td").appendChild(editor);

	const input = editor.querySelector(".nutrient-search");
	const results = editor.querySelector(".nutrient-search-results");

	function renderResults(query) {
		const q = query.toLowerCase();
		const matches = (cachedNutrients || [])
			.filter((n) => {
				if (n.standard_name.includes(q)) return true;
				if (n.aliases.some((a) => a.includes(q))) return true;
				const tr = translations[n.standard_name];
				if (tr && (tr.en.toLowerCase().includes(q) || tr.de.toLowerCase().includes(q))) return true;
				return false;
			})
			.slice(0, 10);

		results.innerHTML = matches
			.map(
				(n) => `<div class="nutrient-search-item" data-standard="${n.standard_name}">
					<span>${t(n.standard_name)}</span>
					<code>${n.standard_name}</code>
				</div>`
			)
			.join("");

		results.querySelectorAll(".nutrient-search-item").forEach((item) => {
			item.addEventListener("click", async () => {
				const newStandard = item.dataset.standard;
				const res = await fetch(`/api/products/${productId}/nutrient`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ index: nutrientIndex, standard_name: newStandard }),
				});
				if (res.ok) {
					const updated = await res.json();
					renderProductDetail(updated);
				}
				editor.remove();
			});
		});
	}

	input.addEventListener("input", () => renderResults(input.value));
	input.addEventListener("keydown", (e) => {
		if (e.key === "Escape") editor.remove();
	});

	// Show all on open
	renderResults("");

	// Close on outside click
	setTimeout(() => {
		document.addEventListener("click", function handler(e) {
			if (!editor.contains(e.target) && e.target !== btn) {
				editor.remove();
				document.removeEventListener("click", handler);
			}
		});
	}, 0);
}

// --- Nutrient Definitions ---

let cachedNutrients = null;

async function loadNutrientDefinitions() {
	const [defsRes, unmatchedRes] = await Promise.all([
		fetch("/api/nutrients"),
		fetch("/api/nutrients/unmatched"),
	]);
	const nutrients = await defsRes.json();
	const unmatched = await unmatchedRes.json();
	cachedNutrients = nutrients;

	renderNutrientFilters(nutrients);
	renderNutrientDefinitions(nutrients);
	renderUnmatched(unmatched);
}

const CATEGORIES = [
	"energy", "macronutrient", "vitamin", "mineral", "fatty_acid",
	"herbal", "mushroom", "plant_extract", "specialty",
];

function renderUnmatched(items) {
	const section = document.getElementById("unmatched-section");
	const list = document.getElementById("unmatched-list");

	if (items.length === 0) {
		section.classList.add("hidden");
		return;
	}

	section.classList.remove("hidden");

	const categoryOptions = CATEGORIES.map((c) => `<option value="${c}">${formatCategory(c)}</option>`).join("");

	list.innerHTML = items
		.map(
			(item) => `
		<div class="unmatched-card" data-standard="${esc(item.nutrient_name_standard)}">
			<div class="unmatched-info">
				<strong>${esc(item.nutrient_name_raw)}</strong>
				<span class="unmatched-meta">${item.occurrences}x found | e.g. ${item.example_amount ?? "?"} ${esc(item.example_unit || "")}</span>
				<code>${esc(item.nutrient_name_standard)}</code>
			</div>
			<div class="unmatched-actions">
				<select class="unmatched-category">
					${categoryOptions}
				</select>
				<input class="unmatched-unit" type="text" placeholder="Unit (mg, g, ...)" value="${esc(item.example_unit || "mg")}">
				<button class="btn-add-nutrient" data-raw="${esc(item.nutrient_name_raw)}" data-standard="${esc(item.nutrient_name_standard)}">Add</button>
			</div>
		</div>`
		)
		.join("");

	list.querySelectorAll(".btn-add-nutrient").forEach((btn) => {
		btn.addEventListener("click", async () => {
			const card = btn.closest(".unmatched-card");
			const category = card.querySelector(".unmatched-category").value;
			const defaultUnit = card.querySelector(".unmatched-unit").value.trim() || "mg";
			const standardName = btn.dataset.standard;
			const rawName = btn.dataset.raw;

			btn.disabled = true;
			btn.textContent = "Adding...";

			try {
				const res = await fetch("/api/nutrients", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						standard_name: standardName,
						category,
						aliases: [rawName.toLowerCase()],
						default_unit: defaultUnit,
					}),
				});

				if (!res.ok) throw new Error("Failed");
				card.remove();

				// Refresh definitions
				await loadNutrientDefinitions();
			} catch (err) {
				btn.disabled = false;
				btn.textContent = "Add";
				alert("Failed to add nutrient: " + err.message);
			}
		});
	});
}

function renderNutrientFilters(nutrients) {
	const categories = [...new Set(nutrients.map((n) => n.category))].sort();
	const filtersEl = document.getElementById("nutrient-filters");

	filtersEl.innerHTML =
		`<button class="filter-btn active" data-category="all">All (${nutrients.length})</button>` +
		categories
			.map((cat) => {
				const count = nutrients.filter((n) => n.category === cat).length;
				return `<button class="filter-btn" data-category="${cat}">${formatCategory(cat)} (${count})</button>`;
			})
			.join("");

	filtersEl.querySelectorAll(".filter-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			filtersEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			const cat = btn.dataset.category;
			const filtered = cat === "all" ? cachedNutrients : cachedNutrients.filter((n) => n.category === cat);
			renderNutrientDefinitions(filtered);
		});
	});
}

function formatCategory(cat) {
	return cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderNutrientDefinitions(nutrients) {
	const tbody = document.querySelector("#nutrients-def-table tbody");
	tbody.innerHTML = nutrients
		.map(
			(n) => `
		<tr>
			<td class="standard-cell">${n.standard_name}</td>
			<td><span class="category-badge category-${n.category}">${formatCategory(n.category)}</span></td>
			<td class="aliases-cell">${n.aliases.join(", ")}</td>
			<td class="unit-cell">${n.default_unit}</td>
		</tr>`
		)
		.join("");
}

// --- Unit Definitions ---

async function loadUnitDefinitions() {
	const res = await fetch("/api/units");
	const units = await res.json();
	renderUnitDefinitions(units);
}

function renderUnitDefinitions(units) {
	const tbody = document.querySelector("#units-def-table tbody");
	tbody.innerHTML = units
		.map(
			(u) => `
		<tr>
			<td class="unit-name">${u.name}</td>
			<td class="aliases-cell">${u.aliases.join(", ")}</td>
		</tr>`
		)
		.join("");
}

// --- Upload ---

uploadBtn.addEventListener("click", () => {
	uploadForm.reset();
	uploadStatus.textContent = "";
	uploadDialog.showModal();
});

uploadDialog.querySelector(".cancel").addEventListener("click", () => {
	uploadDialog.close();
});

uploadForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const formData = new FormData(uploadForm);
	uploadStatus.textContent = "Analyzing image...";

	try {
		const res = await fetch("/api/products/upload", { method: "POST", body: formData });
		if (!res.ok) throw new Error("Upload failed");
		const product = await res.json();
		uploadDialog.close();
		await loadProducts();
		switchView("products", false);
		await loadProduct(product._id);
	} catch (err) {
		uploadStatus.textContent = "Failed: " + err.message;
	}
});

// --- CSV Export ---

document.getElementById("export-csv-btn").addEventListener("click", async () => {
	const res = await fetch("/api/products");
	const products = await res.json();

	const headers = [
		"product_image",
		"product_name",
		"manufacturer",
		"review_status",
		"serving_size",
		"servings_per_container",
		"nutrient_name_raw",
		"nutrient_name_standard",
		"nutrient_display_name",
		"amount",
		"unit",
		"nrv_percent",
		"matched",
	];

	const rows = [];
	for (const p of products) {
		const servingStr = p.serving_size
			? (p.serving_size.amount != null ? `${p.serving_size.amount} ${p.serving_size.unit}` : p.serving_size.raw)
			: "";

		if (p.nutrients.length === 0) {
			rows.push([
				p.filename,
				p.product_name || "",
				p.manufacturer || "",
				p.review_status || "pending",
				servingStr,
				p.servings_per_container ?? "",
				"", "", "", "", "", "", "",
			]);
		} else {
			for (const n of p.nutrients) {
				rows.push([
					p.filename,
					p.product_name || "",
					p.manufacturer || "",
					p.review_status || "pending",
					servingStr,
					p.servings_per_container ?? "",
					n.nutrient_name_raw,
					n.nutrient_name_standard,
					t(n.nutrient_name_standard),
					n.amount ?? "",
					n.unit || "",
					n.nrv_percent ?? "",
					n.matched !== false ? "yes" : "no",
				]);
			}
		}
	}

	const csvContent = [headers, ...rows]
		.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
		.join("\n");

	const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `nutrition_data_${new Date().toISOString().slice(0, 10)}.csv`;
	a.click();
	URL.revokeObjectURL(url);
});

// --- Review Actions ---

document.getElementById("review-actions").addEventListener("click", async (e) => {
	const btn = e.target.closest(".review-btn");
	if (!btn || !currentProductId) return;

	const status = btn.dataset.status;
	const res = await fetch(`/api/products/${currentProductId}/review`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ status }),
	});

	if (res.ok) {
		const updated = await res.json();
		document.querySelectorAll("#review-actions .review-btn").forEach((b) => {
			b.classList.toggle("active", b.dataset.status === updated.review_status);
		});
		// Update the card in the list too
		await loadProducts();
	}
});

// --- Admin Actions ---

const seedBtn = document.getElementById("seed-btn");
const resetBtn = document.getElementById("reset-btn");

seedBtn.addEventListener("click", async () => {
	if (!confirm("Seed from sample images? This will extract any new/missing images.")) return;
	seedBtn.disabled = true;
	seedBtn.textContent = "Seeding...";
	try {
		await fetch("/api/admin/seed", { method: "POST" });
		await waitForSeedComplete();
		await loadProducts();
	} catch (err) {
		alert("Seed failed: " + err.message);
	} finally {
		seedBtn.disabled = false;
		seedBtn.textContent = "Seed";
	}
});

resetBtn.addEventListener("click", async () => {
	if (!confirm("This will DELETE all data from the database. Continue?")) return;
	resetBtn.disabled = true;
	resetBtn.textContent = "Resetting...";
	try {
		await fetch("/api/admin/reset", { method: "POST" });
		await reloadCurrentView();
	} catch (err) {
		alert("Reset failed: " + err.message);
	} finally {
		resetBtn.disabled = false;
		resetBtn.textContent = "Reset DB";
	}
});

async function reloadCurrentView() {
	const activeTab = document.querySelector(".nav-tab.active");
	const view = activeTab ? activeTab.dataset.view : "products";
	if (view === "products") await loadProducts();
	if (view === "nutrients") await loadNutrientDefinitions();
	if (view === "units") await loadUnitDefinitions();
}

// --- Prev / Next Navigation ---

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const productCounter = document.getElementById("product-counter");

function updateNavButtons() {
	const idx = productIds.indexOf(currentProductId);
	prevBtn.disabled = idx <= 0;
	nextBtn.disabled = idx >= productIds.length - 1;
	productCounter.textContent = `${idx + 1} / ${productIds.length}`;
}

prevBtn.addEventListener("click", () => {
	const idx = productIds.indexOf(currentProductId);
	if (idx > 0) loadProduct(productIds[idx - 1]);
});

nextBtn.addEventListener("click", () => {
	const idx = productIds.indexOf(currentProductId);
	if (idx < productIds.length - 1) loadProduct(productIds[idx + 1]);
});

document.addEventListener("keydown", (e) => {
	if (!productDetailEl.classList.contains("hidden") && !e.target.closest("dialog")) {
		if (e.key === "ArrowLeft") prevBtn.click();
		if (e.key === "ArrowRight") nextBtn.click();
		if (e.key === "Escape") showList();
	}
});

// --- Navigation ---

backBtn.addEventListener("click", showList);

// --- Routing ---

function handleRoute() {
	const hash = location.hash.slice(1); // remove #

	if (hash.startsWith("product/")) {
		const id = hash.split("/")[1];
		loadProducts().then(() => loadProduct(id, false));
		switchView("products", false);
	} else if (hash === "nutrients") {
		loadProducts();
		switchView("nutrients", false);
	} else if (hash === "units") {
		loadProducts();
		switchView("units", false);
	} else {
		loadProducts();
		switchView("products", false);
	}
}

window.addEventListener("popstate", handleRoute);

// --- Seed Status Polling ---

const seedBanner = document.getElementById("seed-banner");
const seedProgress = document.getElementById("seed-progress");

async function checkSeedStatus() {
	try {
		const res = await fetch("/api/admin/status");
		const status = await res.json();

		if (status.seeding) {
			seedBanner.classList.remove("hidden");
			if (status.phase === "images" && status.total > 0) {
				seedProgress.textContent = `(${status.processed}/${status.total}) ${status.currentFile}`;
			} else if (status.phase === "definitions") {
				seedProgress.textContent = "Setting up nutrient definitions...";
			}
			return true;
		} else {
			seedBanner.classList.add("hidden");
			return false;
		}
	} catch {
		return false;
	}
}

async function waitForSeedComplete() {
	let seeding = await checkSeedStatus();
	while (seeding) {
		await new Promise((r) => setTimeout(r, 1500));
		seeding = await checkSeedStatus();
		// Refresh product list while seeding so cards appear live
		await loadProducts();
	}
}

// --- Init ---

async function init() {
	await loadTranslations();
	const seeding = await checkSeedStatus();
	handleRoute();
	if (seeding) {
		await waitForSeedComplete();
		await loadProducts();
	}
}

init().catch((err) => console.error("Init failed:", err));
