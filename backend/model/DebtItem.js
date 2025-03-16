import mongoose from "mongoose";

const debtItemSchema = new mongoose.Schema({
    BillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DebtBill",
        required: true
    },
    item: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "INR", "NPR"],
        default: "USD"
    },
    borrower: [{
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
});

const DebtItem = mongoose.model("DebtItem", debtItemSchema);

export default DebtItem;