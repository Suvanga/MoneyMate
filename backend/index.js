import express from "express";
import dotenv from "dotenv";
import connectDB from "./services/mongodb.js";
import userRoutes from "./routes/admin/User/userRoute.js";
import debtRoutes from "./routes/debt/debtRoute.js";
import expenseRoutes from "./routes/expense/expenseRoute.js";
import ocrRoutes from './routes/ocrRoute.js';
import { connectOpenAI } from "./services/openai.js";
console.log("Starting server setup...");
const app = express();
dotenv.config();

connectDB();
connectOpenAI();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/debt', debtRoutes);
app.use('/expense', expenseRoutes);


app.use('/ocr', ocrRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

});