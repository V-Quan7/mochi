import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import NavigationRoutes from './routes/NavigationRoutes.js';
import ProductRoutes from './routes/ProductRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('backend is running successfully');
});
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);

    }
}
connectDB();

app.use("/api/navigation", NavigationRoutes);
app.use("/api/products", ProductRoutes);
// app.use("/api/auth", AuthRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
