import { Navigation } from "../models/Navigation.js";

export const createNavigation = async (req, res) => {
    try {
        const data = req.body;

        // Kiểm tra nếu dữ liệu gửi lên là một Mảng (Array)
        if (Array.isArray(data)) {
            // insertMany giúp lưu hàng loạt và giữ nguyên cấu trúc (bao gồm cả children)
            const newNavigations = await Navigation.insertMany(data);
            return res.status(201).json({
                message: "Lưu danh sách menu thành công",
                data: newNavigations
            });
        }

        // Nếu chỉ gửi một object đơn lẻ
        const newNavigation = await Navigation.create(data);
        return res.status(201).json({
            data: newNavigation
        });

    } catch (error) {
        console.error("Error creating navigation:", error);

        // Trả về lỗi 400 nếu dữ liệu sai định dạng thay vì 500
        res.status(400).json({
            message: "Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc",
            error: error.message
        });
    }
}

export const getAllNavigations = async (req, res) => {
    try {
        const navigation = await Navigation.find();
        res.status(200).json({
            data: navigation
        });
    } catch (error) {
        console.error("Error fetching navigations:", error);
        res.status(500).json({
            message: "Error fetching navigations", error
        });
    }
}

// --- CẬP NHẬT (PUT) ---
export const updateNavigation = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // findByIdAndUpdate sẽ tìm theo _id và cập nhật dữ liệu mới
        // { new: true }: Trả về bản ghi mới sau khi đã sửa
        // { runValidators: true }: Đảm bảo dữ liệu mới vẫn tuân thủ Schema
        const updatedNav = await Navigation.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedNav) {
            return res.status(404).json({ message: "Không tìm thấy menu để cập nhật" });
        }

        res.status(200).json({
            message: "Cập nhật thành công",
            data: updatedNav
        });
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật", error: error.message });
    }
};

// --- XÓA (DELETE) ---
export const deleteNavigation = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedNav = await Navigation.findByIdAndDelete(id);

        if (!deletedNav) {
            return res.status(404).json({ message: "Không tìm thấy menu để xóa" });
        }

        res.status(200).json({
            message: "Đã xóa menu thành công"
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa", error: error.message });
    }
};

// thêm chức năng thêm menu con vào menu cha
export const addChildNavigation = async (req, res) => {
    try {
        const { id } = req.params; // ID của menu cha
        const childData = req.body; // { name: "Gấu bông", slug: "/teddy" }

        const updatedNav = await Navigation.findByIdAndUpdate(
            id,
            { $push: { children: childData } }, // Dùng $push để thêm vào mảng
            { new: true }
        );

        res.status(200).json(updatedNav);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};