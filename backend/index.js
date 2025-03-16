import express from "express";
import dotenv from "dotenv";
import connectDB from "./services/mongodb.js";
import userRoutes from "./routes/admin/User/userRoute.js";
import debtRoutes from "./routes/debt/debtRoute.js";
import expenseRoutes from "./routes/expense/expenseRoute.js";

const app = express();
dotenv.config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/debt', debtRoutes);
app.use('/expense', expenseRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);

});