import express from 'express';
import expenseController from '../../Controller/expenseController.js';
import openAIController from '../../Controller/OpenAIController.js'; // Import OpenAI controller
const router = express.Router();

router.post('/newExpense', expenseController.createExpense);
router.get('/getexpense/:expenseId', expenseController.getExpenseById);
router.get('/getexpenseItems/:expenseId', expenseController.getExpenseItemsByExpenseId);
router.get('/getexpenseByStores/:user/:store', expenseController.getExpensesByStore); //Also provides the total amount of expenses in that store
router.get('/getExpensesByDateRangeAndUser/:dateRange', expenseController.getExpensesByDateRangeAndUser);
router.get('/expensesrange/date-range', expenseController.getExpensesByDateRangeAndUser);//This should Have MM/DD/YYYY format
router.put('/updateExpense/:expenseId', expenseController.updateExpense);
router.delete('/deleteExpense/:expenseId', expenseController.deleteExpense);
router.delete('/deleteExpenseItem/:expenseItemId', expenseController.deleteExpenseItem);
router.get('/getexpenseByUser/:user', expenseController.getExpenseByUser);

router.get('/getFeedbackByUser/:user', openAIController.getFeedbackByUser); // New route for OpenAI feedback

export default router;