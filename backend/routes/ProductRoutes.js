import express from "express";
import uploadCloud from "../config/cloudinary.js";
import {
    createProduct, getProducts, getProductBySlug, deleteProduct, updateProduct
} from "../controllers/productController.js";

// Import Middleware bảo vệ của Clerk
import { requireAuth, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();
// 1. Công khai: Ai cũng có thể xem sản phẩm
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// 2. Bảo mật: Chỉ Admin đã đăng nhập mới được thực hiện các thao tác dưới đây
// requireAuth: Kiểm tra người dùng đã đăng nhập chưa
// isAdmin: Kiểm tra xem người dùng đó có Metadata role là "admin" hay không
// Thêm sản phẩm
router.post("/", uploadCloud.array('images', 5), createProduct);

// Xóa sản phẩm 
router.delete("/:id", deleteProduct);
// router.delete("/:id", requireAuth, isAdmin, deleteProduct);

// Cập nhật sản phẩm
router.put("/:id", uploadCloud.array('images', 5), updateProduct);

export default router;