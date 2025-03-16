import ExpenseService from "../services/ExpenseServices.js";

const isInvalidExpenseBillData = function(expenseBillData) {
    return !expenseBillData?.store || !expenseBillData?.amount || !expenseBillData?.CardType;
};

const createExpense = async (req, res) => {
    const { expenseBillData, expenseItemData } = req.body;

    if (isInvalidExpenseBillData.call(this, expenseBillData)) {
        return res.status(400).json({
            message: "Please enter all required Bill fields!"
        });
    }

    if (!expenseItemData || expenseItemData.length < 1) {
        return res.status(400).json({
            message: "Please enter at least one Expense Item!"
        });
    }

    try {
        const { savedExpense, savedExpenseItem } = await ExpenseService.createExpense(expenseBillData, expenseItemData);
        return res.status(201).json({ savedExpense, savedExpenseItem });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while creating the Expense!"
        });
    }
};

const getExpenseById = async (req, res) => {
    const expenseId = req.params.expenseId.trim();

    if (!expenseId) {
        return res.status(400).json({
            message: "Please enter Expense Id!"
        });
    }

    try {
        const expense = await ExpenseService.findExpenseById(expenseId);
        if (!expense) {
            return res.status(404).json({
                message: "Expense not found!"
            });
        }
        return res.status(200).json(expense);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Invalid Expense Id!"
        });
    }
};

const getExpenseItemsByExpenseId = async (req, res) => {
    const expenseId = req.params.expenseId.trim();

    if (!expenseId) {
        return res.status(400).json({
            message: "Please enter Expense Bill Id to find items!"
        });
    }

    try {
        const expenseItems = await ExpenseService.findExpenseItemsByExpenseId(expenseId);
        return res.status(200).json(expenseItems);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Expense Items!"
        });
    }
};



const getExpensesByStore = async (req, res) => {
    const store = req.params.store.trim();

    if (!store) {
        return res.status(400).json({
            message: "Please enter Store!"
        });
    }

    try {
        const expenses = await ExpenseService.findExpensesByStore(store);
        return res.status(200).json(expenses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Expenses!"
        });
    }
};



const updateExpense = async (req, res) => {
    const expenseId = req.params.expenseId.trim();
    const updatedData = req.body;

    if (!expenseId) {
        return res.status(400).json({
            message: "Please enter Expense Id!"
        });
    }

    if (!updatedData) {
        return res.status(400).json({
            message: "Please enter new data!"
        });
    }

    try {
        const updatedExpense = await ExpenseService.updateExpense(expenseId, updatedData);
        return res.status(200).json(updatedExpense);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while updating the Expense!"
        });
    }
};

const deleteExpense = async (req, res) => {
    const expenseId = req.params.expenseId.trim();

    if (!expenseId) {
        return res.status(400).json({
            message: "Please enter Expense Id!"
        });
    }

    try {
        await ExpenseService.deleteExpense(expenseId);
        return res.status(200).json({
            message: "Expense deleted successfully!"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while deleting the Expense!"
        });
    }
};


export default {
    createExpense,
    getExpenseById,
    getExpenseItemsByExpenseId,
    getExpensesByStore,
    updateExpense,
    deleteExpense
};