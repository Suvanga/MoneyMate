//Model>>expense>naam: exoenseBill.js
import mongoose from "mongoose";

const expenseBillSchema = new mongoose.Schema({

    store:
    {
        type: String,
        required: true
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "INR","NPR"],
        default: "USD",
    },
    CardType:{
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: 0.01, // Ensure the amount is positive
    },
    tip:{
        type: Number,
        default: 0.00   
    },
    TotalAmount:{
        type: Number,
        required: true  
    },
    date: {
        type: Date,
        default: Date.now,
    }

}, {
    timestamps: true
});

const expenseBill = mongoose.model("ExpenseBill", expenseBillSchema);

export default expenseBill;