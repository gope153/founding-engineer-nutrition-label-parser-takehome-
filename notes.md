## My process

I first reviewed all images and quickly noticed that they are AI-generated. Several issues became obvious right away, for example incorrect labels like Vitamin 812 instead of B12 or descriptions that do not fully make sense. Some images are also very low resolution, making them hard to read.

I assumed that some of these issues were intentionally introduced to test how one handles imperfect data. At the same time, some errors look like they were simply overlooked. There are basically two ways to approach this, either reject the dataset entirely because it is flawed, or assume that in a real scenario the data would be clean and this is just a test setup. So moving on.

For a production scenario, I assume that high-quality images would be used and that the product information is fundamentally correct. The focus here seems to be on parsing rather than validation, even though the example data would actually require both.

From a technical perspective, I decided against OCR. While it would work, I do not consider it a good solution for proper parsing today. A modern AI-based approach is more appropriate, and cost should not be the deciding factor in this case.

I initially built a small microservice in about 15 minutes. However, it was not modular enough and would not be usable for non-technical users. Therefore, I decided to build a complete, usable solution that could realistically function as a parser.

The stack is Node.js, Express.js, MongoDB, and a simple frontend using Vanilla.js, HTML, and CSS.

During implementation, several content-related issues appeared. For example, fish oil is an ingredient, not a nutritional value. Also, incorrect labels like Vitamin 812 appeared multiple times. To handle this, I created a full mapping of all nutritional values, including translations and units, and seeded this data into the database at startup.

I intentionally skipped user authentication because it would be overkill for this project. It would be a clear next step, along with proper security if the system were to be deployed.

The data model includes products with filename, product name, serving size, servings per container, image quality notes, review status, and all nutritional values.

From a UX perspective, the system separates products, nutrients, and units. Users can open a product, view all serving sizes and nutritional values including NRV if available, approve or flag entries, navigate through products, export CSV, reset the database, and upload new images. Detected values can also be manually corrected during the review process.

## What I built

A complete parser application that processes images, stores structured nutritional data, and provides a review and correction interface.

This includes a backend with API, database, and seeded nutritional mappings, as well as a frontend that allows users to view, edit, and manage the parsing workflow.

### The architecture

I defined a specific architecture. Building on modules and in this case not a class approach, but service approach. It's easier to handle in smaller projects. I'd prefer a class approach in bigger projects. Building the modules seperately and having single models, helpers and configurations are the base for this project. 

This approach should handle all the images need and its modular enough to proceed. 

## What I did not build and why

User authentication and security were not implemented because they are not necessary for the scope of this test project. 

Also E2E Tests as well as a good documentation for the api would be absolute minimum and would take another 30-60 minutes to implement. 

I also did not implement deep validation logic, as I assume that in a real production setup the data would already be clean and the focus here is on parsing.

## Hardest part

The hardest part was determining what exactly was expected by the founders.

Since this is a test project without clear requirements, the main challenge was deciding whether to build something minimal or something actually usable. I chose to approach it as if I were building a real parser for this use case.

## What I would build next

A full user system with authentication and roles.

Improved UX, especially for faster review workflows.

Advanced validation and automated error detection.

Further parsing improvements for different layouts and more complex labels.

Scaling the architecture to handle larger volumes of images.

## What the functionality in frontend consists of

### Products
- Product grid overview with thumbnails, product name, manufacturer, and nutrient count
- Product detail view with large image (sticky, side-by-side with data on widescreen)
- Serving size and servings per container displayed as structured badges
- Nutrient table with translated display name (DE), raw label name in italic brackets, amount, unit, %NRV
- Unknown/unmatched nutrients highlighted in yellow with UNKNOWN badge
- Edit button per nutrient to correct the standard_name mapping via inline searchable dropdown
- Image quality flags on cards (AI-generated, low quality, unreadable) — detected automatically by Claude
- Review status system: Pending, Approved, Flagged, Denied — clickable buttons, persisted to DB
- Review status badges and colored borders on product cards (orange for flagged, red for denied, green for approved)
- Prev/Next navigation between products with keyboard shortcuts (arrow left/right, Escape to go back)
- Product counter (e.g. "3 / 13")
- URL routing via hash (#product/id, #nutrients, #units) — survives page reload and supports browser back
- Raw JSON toggle per product for debugging the full data object
- Upload image dialog (centered modal) — sends to Claude Vision for extraction, redirects to new product detail after completion
- CSV export of all products and nutrients with translated names, review status, serving info, matched flag, and date in filename

### Nutrients
- Nutrient definitions table with standard name, category (color-coded badges), aliases, and default unit
- Category filter buttons with counts (e.g. "Vitamin (21)", "Mineral (18)")
- Unmatched nutrients section — aggregated across all products with occurrence count and example values
- One-click add of unmatched nutrients to definitions: choose category, set default unit, confirm
- Adding a nutrient automatically re-matches all existing products that contain it

### Units
- Unit definitions table with canonical name and all recognized aliases
- Hardcoded from code (not from DB) — units are a fixed, deterministic set
- Includes weight (mg, g, µg), energy (IU, kJ, kcal), volume (ml, l), serving units (capsule, tablet, scoop, etc.), and probiotic/enzyme units (CFU, FU, SPU)

### Admin
- Seed button — triggers extraction of new/missing sample images via Claude Vision
- Reset DB button — drops all collections without automatic reseed
- Seed status banner with animated spinner, progress counter (e.g. "5/13"), and current filename — appears during seeding
- Live product list refresh during seeding so cards appear as they are processed

### General
- Tab navigation: Products, Nutrients, Units
- Mobile responsive layout (stacked detail view below 900px, smaller cards/fonts below 720px, wrapped review buttons)
- German translation layer for all 228 nutrient display names via backend translations endpoint
- HTML escaping (esc helper) on all user-generated content to prevent XSS
- .editorconfig enforcing tabs with tab width 4 across the project


## How to start the project

I inserted a mongodb connection hardcoded so you can just run npm run dev and the server will start. But it's easy to host it on my server so you can just see it online. I wasn't sure if you would accept to show i, so i decided against this. 