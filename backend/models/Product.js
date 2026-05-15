import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
    {
        //- basic information
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, trim: true },
        sku: { type: String },
        // image
        image: { type: String },
        images: [{ type: String }],
        //- price
        price: { type: Number, required: true },
        oldPrice: { type: Number },
        discount: { type: Number, default: 0 },
        // phân loại liên kết danh mục product với category
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Navigation",
            required: true
        },
        // details product
        shortDescription: { type: String },
        description: { type: String },
        specifications: [
            {
                key: String,
                value: String
            }
        ],
        // trạng thái kho hàng
        countInStock: { type: Number, default: 0, min: 0 },
        sold: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        active: { type: Boolean, default: true },
        // đánh giá 
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },

    }, { timestamps: true }
)
export const Product = mongoose.model("Product", productSchema);