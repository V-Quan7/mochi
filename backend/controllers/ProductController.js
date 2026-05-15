import { Product } from '../models/Product.js';
import { Navigation } from '../models/Navigation.js';
// lấy danh sách sản phẩm có lọc(có lọc theo Category, Featured, Search)
export const getProducts = async (req, res) => {
    try {
        const { categoryId, featured, search, limit } = req.query;
        let filter = {};
        //  filter product featured
        if (featured == "true") filter.isFeatured = true;
        if (search) filter.name = { $regex: search, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
        if (categoryId) {

            const currentNav = await Navigation.findById(categoryId);
            if (currentNav) {
                if (currentNav.children && currentNav.children.length > 0) {
                    // nếu là danh mục cha thì lấy hết các product có categoryId là id của nó hoặc id của các danh mục con
                    const subIds = currentNav.children.map(child => child._id);
                    filter.categoryId = { $in: subIds };
                } else {
                    filter.categoryId = categoryId;
                }
            }
        }
        const products = await Product.find(filter)
            .populate("categoryId", "name slug") // Lấy thông tin category (chỉ lấy name và slug)
            .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
            .limit(limit ? parseInt(limit) : 20); // Giới hạn số lượng sản phẩm trả về (mặc định 20)
        res.status(200).json({ products });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).populate("categoryId");
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// 3. TẠO MỚI SẢN PHẨM (Tích hợp Cloudinary)
export const createProduct = async (req, res) => {
    try {
        const data = req.body;

        // Xử lý hình ảnh từ Cloudinary (qua middleware uploadCloud)
        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map(file => file.path);
            data.images = imageUrls;          // Mảng các ảnh chi tiết
            data.image = imageUrls[0];        // Lấy ảnh đầu tiên làm ảnh đại diện
        }

        // Xử lý specifications nếu gửi lên dạng string JSON
        if (typeof data.specifications === 'string') {
            data.specifications = JSON.parse(data.specifications);
        }

        const newProduct = await Product.create(data);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Dữ liệu không hợp lệ", error: error.message });
    }
};

// 4. CẬP NHẬT SẢN PHẨM
export const updateProduct = async (req, res) => {
    try {
        const updateData = req.body;

        // Nếu có upload ảnh mới
        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map(file => file.path);
            updateData.images = imageUrls;
            updateData.image = imageUrls[0];
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: "Cập nhật thất bại", error: error.message });
    }
};

// 5. XÓA SẢN PHẨM
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Đã xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error: error.message });
    }
};