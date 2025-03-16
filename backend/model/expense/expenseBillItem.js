import mongoose from "mongoose";    

const expenseBillItemSchema = new mongoose.Schema({
  
    BillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "expenseBill",
        required: true
    },
    itemName:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    amount:{
        type: Number,
        required: true
    }
})
const expenseBillItem = mongoose.model("expenseBillItem", expenseBillItemSchema);

export default expenseBillItem;