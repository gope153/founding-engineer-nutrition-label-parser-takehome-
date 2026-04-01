import { Product, INutrient, IProduct, IServingSize, IImageQuality, ReviewStatus } from "../../models/product";

export async function getAllProducts(): Promise<IProduct[]> {
    return Product.find({}, "filename product_name manufacturer createdAt serving_size servings_per_container image_quality review_status nutrients").sort({ filename: 1 }).lean();
}

export async function getProductById(id: string): Promise<IProduct | null> {
    return Product.findById(id).lean();
}

export async function getProcessedFilenames(): Promise<Set<string>> {
    const docs = await Product.find({}, "filename").lean();
    return new Set(docs.map((d) => d.filename));
}

export interface CreateProductData {
    filename: string;
    image_path: string;
    product_name: string | null;
    manufacturer: string | null;
    serving_size: IServingSize | null;
    servings_per_container: number | null;
    image_quality: IImageQuality;
    nutrients: INutrient[];
}

export async function createProduct(data: CreateProductData): Promise<IProduct> {
    return Product.create(data);
}

export async function updateReviewStatus(id: string, status: ReviewStatus): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, { review_status: status }, { returnDocument: "after" }).lean();
}

export async function updateNutrientStandardName(
    productId: string,
    nutrientIndex: number,
    newStandardName: string
): Promise<IProduct | null> {
    const product = await Product.findById(productId);
    if (!product || nutrientIndex < 0 || nutrientIndex >= product.nutrients.length) return null;

    product.nutrients[nutrientIndex].nutrient_name_standard = newStandardName;
    product.nutrients[nutrientIndex].matched = true;
    await product.save();

    return product.toObject();
}
