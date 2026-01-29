import ExpenseService from "../services/ExpenseServices.js";

const isInvalidExpenseBillData = function (expenseBillData) {
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
    const userId = req.params.user.trim();
    const store = req.params.store.trim();


    if (!userId) {
        return res.status(400).json({
            message: "Please enter User to find items!"
        });
    }

    if (!store) {
        return res.status(400).json({
            message: "Please enter Store!"
        });
    }

    try {
        const { expenses, totalAmount } = await ExpenseService.findExpensesByUserAndStore(userId, store);
        const Amount = expenses.reduce((sum, expense) => sum + (expense.TotalAmount || 0), 0);

        return res.status(200).json({
            expenses,
            Amount
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Expenses!"
        });
    }
};

const getExpenseByUser = async (req, res) => {
    const userId = req.params.user.trim();

    if (!userId) {
        return res.status(400).json({
            message: "Please enter User to find items!"
        });
    }

    try {
        const expenseItems = await ExpenseService.findExpenseItemsByUserId(userId);
        return res.status(200).json(expenseItems);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Expense Items!"
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


const getExpensesByDateRangeAndUser = async (req, res) => {
    try {
        const { startDate, endDate, userId } = req.query;

        if (!startDate || !endDate || !userId) {
            return res.status(400).json({ message: "Missing required parameters: startDate, endDate, or userId" });
        }

        // Parse MM/DD/YYYY format to Date objects
        const parseDate = (dateStr) => {
            const [month, day, year] = dateStr.split("/").map(Number);
            return new Date(year, month - 1, day);
        };

        const parsedStartDate = parseDate(startDate);
        const parsedEndDate = parseDate(endDate);
        parsedEndDate.setHours(23, 59, 59, 999); // Include the entire end date

        const expenses = await ExpenseService.findExpensesByDateRangeAndUser(parsedStartDate, parsedEndDate, userId);

        // Format dates in the response as MM/DD/YYYY
        const formattedExpenses = expenses.map(expense => ({
            ...expense._doc,
            date: expense.date.toLocaleDateString("en-US"), // Format date as MM/DD/YYYY
        }));

        return res.status(200).json(formattedExpenses);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching expenses." });
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


const deleteExpenseItem = async (req, res) => {
    const expenseItemId = req.params.expenseItemId.trim();

    if (!expenseItemId) {
        return res.status(400).json({
            message: "Please provide an Expense Item ID to delete!"
        });
    }

    try {
        const deletedExpenseItem = await ExpenseService.deleteExpenseItem(expenseItemId);

        return res.status(200).json({
            message: "Expense Item deleted successfully!",
            deletedExpenseItem
        });
    } catch (err) {
        console.error(err.message);
        return res.status(404).json({
            message: err.message || "An error occurred while deleting the Expense Item."
        });
    }
};

export default {
    createExpense,
    getExpenseById,
    getExpenseItemsByExpenseId,
    getExpensesByStore,
    getExpensesByDateRangeAndUser,
    updateExpense,
    deleteExpense,
    deleteExpenseItem,
    getExpenseByUser
};