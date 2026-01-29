import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import bodyParser from "body-parser";
import expenseRoutes from "../routes/expense/expenseRoute.js";
import { connectOpenAI } from "../services/openai.js"; 
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" }); 
let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
  await connectOpenAI(); 
  app = express();
  app.use(bodyParser.json());
  app.use("/api/expense", expenseRoutes);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("OpenAI Feedback Integration Tests", () => {
  it("should return feedback for user with no expenses", async () => {
    const userId = "67f6f038a6dbae9db749e746"; // no expenses
    const res = await request(app).get(`/api/expense/getFeedbackByUser/${userId}`);

    expect(res.status).toBe(200);
    console.log(res.body); // Log the response body for looking what type of feedback would the user get :) 
    expect(res.body).toHaveProperty("feedback");
    expect(typeof res.body.feedback).toBe("string");
    expect(res.body.feedback.length).toBeGreaterThan(0);
  });
  it("should return feedback ", async () => {
    const userId = "67ec4bb5cd0dcecc76446ec5"; // using new userid and sending post expenses as json with required data
  
    // Seed an expense
    await request(app).post("/api/expense/newExpense").send({
      expenseBillData: {
        user: userId,
        store: "KMart",
        amount: 2000,
        CardType: "Credit",
        currency: "USD",
        tip: 5.25,
        TotalAmount: 2005.25,
        date: "2025-04-10T12:30:00Z"
      },
      expenseItemData: [
        {
          itemName: "Groceries",
          quantity: 1,
          amount: 2000
        }
      ]
    });
  
    // Now request feedback
    const res = await request(app).get(`/api/expense/getFeedbackByUser/${userId}`);
  
    expect(res.status).toBe(200);
    console.log(res.body); // Debug
    expect(res.body).toHaveProperty("feedback");
    expect(typeof res.body.feedback).toBe("string");
    expect(res.body.feedback.length).toBeGreaterThan(0);
  });
  
});
