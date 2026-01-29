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

    static async findExpenseItemsByUserId(userId) {
        return ExpenseBill.find({ user: userId }).sort({ createdAt: -1 }).exec();
    }

    static async findExpensesByUserAndStore(userId, store) {
        const expenses = await ExpenseBill.find({ user: userId, store }).sort({ createdAt: -1 }).exec();
        const totalAmountResult = await ExpenseBill.aggregate([
            { $match: { user: userId, store } },
            { $group: { _id: null, total: { $sum: "$TotalAmount" } } }
        ]);

        const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

        return { expenses, totalAmount };
    }

    static async findExpensesByDateRangeAndUser(startDate, endDate, userId) {
        return ExpenseBill.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 }).exec();
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

    static async deleteExpenseItem(expenseItemId) {
        // Check if the expense item exists
        const expenseItem = await ExpenseBillItem.findById(expenseItemId).exec();
        if (!expenseItem) {
            throw new Error("Expense Item not found or invalid ID.");
        }

        // Proceed to delete the expense item
        return ExpenseBillItem.deleteOne({ _id: expenseItemId }).exec();
    }
}

export default ExpenseService;