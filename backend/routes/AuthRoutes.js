import express from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Route này chỉ dùng để tạo tài khoản Admin đầu tiên
router.post('/register-admin-secret-6868', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email đã tồn tại!" });

        // Mã hóa mật khẩu trước khi lưu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await User.create({
            email,
            password: hashedPassword,
            role: "admin" // Quan trọng: Phải có role này
        });

        res.status(201).json({ message: "Tạo Admin thành công!", adminId: admin._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;