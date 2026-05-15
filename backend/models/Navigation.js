import mongoose from "mongoose";

const navigationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true // Tự động xóa khoảng trắng thừa
        },
        slug: {
            type: String,
            required: true,
            trim: true
        },
        icon: {
            type: String,
            default: "Circle",
        },
        order: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
        // Thêm trường này để chứa các menu con
        children: [
            {
                name: String,
                slug: String,
                icon: String,
                order: { type: Number, default: 0 }
            }
        ],
    },
    {
        timestamps: true,
    }
);

// Tạo index để tìm kiếm slug nhanh hơn và đảm bảo không trùng lặp nếu cần
// navigationSchema.index({ slug: 1 }); 

export const Navigation = mongoose.model("Navigation", navigationSchema);