import ExpenseBill from "../model/expense/expenseBill.js";
import ExpenseBillItem from "../model/expense/expenseBillItem.js";

class ExpenseService {
    static async createExpense(expenseBillData, expenseItemData) {
        const newExpense = new ExpenseBill(expenseBillData);
        const savedExpense = await newExpense.save();

        const expenseItemsWithBillId = expenseItemData.map(item => ({
            ...item,
            BillId: savedExpense._id
        }));

        const savedExpenseItem = await ExpenseBillItem.insertMany(expenseItemsWithBillId);
        return { savedExpense, savedExpenseItem };
    }

    static async findExpenseById(expenseId) {
        return ExpenseBill.findById(expenseId).sort({ createdAt: -1 }).exec();
    }

    static async findExpenseItemsByExpenseId(expenseBillId) {
        return ExpenseBillItem.find({ BillId: expenseBillId }).exec();
    }

    static async findExpensesByStore(store) {
        const expenses = await ExpenseBill.find({ store }).sort({ createdAt: -1 }).exec();
        const totalAmount = await ExpenseBill.aggregate([
            { $match: { store } },
            { $group: { _id: null, total: { $sum: "$TotalAmount" } } }
        ]);
        return { expenses, totalAmount: totalAmount[0]?.total || 0 };
    }

    static async updateExpense(expenseId, updatedData) {
        const { expenseBillData, expenseItemData } = updatedData;

        const updatedExpense = await ExpenseBill.findByIdAndUpdate(expenseId, expenseBillData, { new: true }).exec();
        if (expenseItemData) {
            for (const item of expenseItemData) {
                await ExpenseBillItem.findByIdAndUpdate(item._id, item, { new: true }).exec();
            }
        }
        return updatedExpense;
    }

    static async deleteExpense(expenseId) {
        await ExpenseBillItem.deleteMany({ BillId: expenseId }).exec();
        return ExpenseBill.deleteOne({ _id: expenseId }).exec();
    }
    
}

export default ExpenseService;