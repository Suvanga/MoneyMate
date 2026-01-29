import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

let openaiInstance;

const connectOpenAI = () => {
    try {
        console.log("Initializing OpenAI API...");
        openaiInstance = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        console.log("OpenAI API initialized successfully");
    } catch (error) {
        console.error("Failed to initialize OpenAI API:", error.message);
        process.exit(1);
    }
};

const getOpenAIInstance = () => {
    if (!openaiInstance) {
        throw new Error("OpenAI API is not initialized. Call connectOpenAI first.");
    }
    return openaiInstance;
};

export { connectOpenAI, getOpenAIInstance };
