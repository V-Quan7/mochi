import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// config Cloudinary
cloudinary.config({
    cloud_name: "dtwcrwofn",
    api_key: "942866193297465",
    api_secret: "Y5pKBrQFPoANBAnVFaWMf-To4w4"
})

// config Multer (Storage)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products', // Tên thư mục trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }] // Tự động resize ảnh đẹp
    },
});
const uploadCloud = multer({ storage });
export default uploadCloud;