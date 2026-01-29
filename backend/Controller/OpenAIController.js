import expenseService from "../services/ExpenseServices.js";
import { getOpenAIInstance } from "../services/openai.js";

const getFeedbackByUser = async (req, res) => {
    try {
        const userId = req.params.user;

        // Fetch expenses for the user
        const expenses = await expenseService.findExpenseItemsByUserId(userId);
        // console.log("Fetched expenses:", expenses); this is for debugging to see what data is being sent to OpenAI

        // if (!expenses || expenses.length === 0) {
        //     return res.status(404).json({ message: "No expenses found for this user." });
        // }

        // Prepare data
        const requestData = {
            expenses,
            Amount: expenses.reduce((total, expense) => total + (expense.TotalAmount || 0), 0),
        };
        // console.log("Request data for OpenAI:", requestData);

        // Get OpenAI instance
        const openai = getOpenAIInstance();

        // Send to OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful financial assistant that gives concise and friendly feedback on user spending." },
                {
                    role: "user",
                    content: `Here is the user's expense data: ${JSON.stringify(requestData)}. 
                    Based on this, give a short, clear summary (no more than 5 lines, and if you can't find data give generic finance feedback) in one single paragraph.
                    Avoid any numbered lists or line breaks. No bullet points. Just plain text.`,
                },
            ],
        });
        
        // Fix: Access `completion.choices[0].message.content`
        const feedback = completion.choices[0].message.content;

        res.status(200).json({ feedback });
    } catch (error) {
        console.error("Error in getFeedbackByUser:", error);

        // Log actual OpenAI error if present
        if (error.response?.data) {
            console.error("OpenAI response error:", error.response.data);
        }

        res.status(500).json({
            message: "An error occurred while processing the request.",
            error: error.message,
        });
    }
};

export default { getFeedbackByUser };
