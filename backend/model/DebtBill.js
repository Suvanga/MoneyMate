import mongoose from "mongoose";

const debtBillSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01, // Ensure the amount is positive
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "INR", "NPR"],
        default: "USD",
    },
    status: {
        type: String,
        enum: ["paid", "not paid", "partially paid"],
        default: "not paid",
    },
    description: {
        type: String,
        trim: true,
    },
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    participant: [{
        person: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        paid: {
            type: Number,
            required: true,
            default: 0,
        },
        due: {
            type: Number,
            required: true,
            default: 0,
        },
    },],
}, {
    timestamps: true
});

const DebtBill = mongoose.model("Debt", debtBillSchema);

export default DebtBill;