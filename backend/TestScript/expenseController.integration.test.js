import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import bodyParser from "body-parser";
import expenseRoutes from "../routes/expense/expenseRoute.js";
import "../services/mongodb.js"; // Optional, if you have centralized DB logic

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app = express();
  app.use(bodyParser.json());
  app.use("/api/expense", expenseRoutes);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("ExpenseController Integration Tests", () => {
  //This test is for creating a new expense with valid data
  it("should create a new expense", async () => {
    const res = await request(app).post("/api/expense/newExpense").send({
      expenseBillData: {
        user: "67ec4bb5cd0dcecc76446ec5",  // realistic user ID format
        store: "KMart",
        amount: 2000.75,
        CardType: "Credit",
        currency: "USD",
        tip: 6.20,
        TotalAmount: 1929.95,
        date: "2024-05-27T20:10:00.000Z"
      },
      expenseItemData: [
        {
          itemName: "Chicken kebab",
          quantity: 32,
          amount: 2000
        }
      ]
    });


    expect(res.status).toBe(201);
    expect(res.body.savedExpense).toBeDefined();
    expect(res.body.savedExpenseItem.length).toBe(1);
  });

  
// This test is for creating a new expense with invalid data
  it("should return 400 if no expense items are provided, but the bill is provided", async () => {
    const res = await request(app).post("/api/expense/newExpense").send({
      expenseBillData: {
        user: "67ec4bb5cd0dcecc76446ec5",  // realistic user ID format
        store: "KMart",
        amount: 2000.75,
        CardType: "Credit",
        currency: "USD",
        tip: 6.20,
        TotalAmount: 1929.95,
        date: "2024-05-27T20:10:00.000Z"
      },
      expenseItemData: []
    });

    expect(res.status).toBe(400)}); 
});

// This test is for receiving all expenses from the part
it("should get expenses by user", async () => {
    const userId = "67ec4bb5cd0dcecc76446ec5";
  
    // Seed an expense first
    await request(app).post("/api/expense/newExpense").send({
      expenseBillData: {
        user: userId,
        store: "Walmart",
        amount: 20,
        CardType: "N/A",
        currency: "USD",
        tip: 0,
        TotalAmount: 20,
        date: new Date().toISOString()
      },
      expenseItemData: [
        {
          itemName: "Milk",
          quantity: 1,
          amount: 20
        }
      ]
    });
  
    const res = await request(app).get(`/api/expense/getExpensebyUser/${userId}`);
  
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  
    const firstItem = res.body[0];
    expect(firstItem).toHaveProperty("user", userId);
    expect(firstItem).toHaveProperty("store");
    expect(firstItem).toHaveProperty("amount");
    expect(firstItem).toHaveProperty("TotalAmount");
    // expect(firstItem).toHaveProperty("CardType");
  });

  
  it("should update an existing expense", async () => {
    const seedResponse = await request(app).post("/api/expense/newExpense").send({
      expenseBillData: {
        user: "67ec4bb5cd0dcecc76446ec5",
        store: "Target",
        amount: 100,
        CardType: "Debit",
        currency: "USD",
        tip: 5,
        TotalAmount: 105,
        date: new Date().toISOString(),
      },
      expenseItemData: [
        {
          itemName: "Notebook",
          quantity: 2,
          amount: 50,
        },
      ],
    });
  
    expect(seedResponse.status).toBe(201);
    const expenseId = seedResponse.body.savedExpense._id;
  
    const updateResponse = await request(app)
      .put(`/api/expense/updateExpense/${expenseId}`)
      .send({
        expenseBillData: {
          store: "Updated Store",
          amount: 150,
          TotalAmount: 155,
        }
      });
  
    expect(updateResponse.status).toBe(200);
    const updated = updateResponse.body.updatedExpense || updateResponse.body;
    expect(updated).toHaveProperty("amount", 150);
    expect(updated).toHaveProperty("TotalAmount", 155);
    expect(updated).toHaveProperty("store", "Updated Store");
  });
  
  
  it("should delete an existing expense", async () => {
    // Step 1: Seed an expense
    const seedResponse = await request(app).post("/api/expense/newExpense").send({
      expenseBillData: {
        user: "67ec4bb5cd0dcecc76446ec5",
        store: "DeleteMeMart",
        amount: 250,
        CardType: "Credit",
        currency: "USD",
        tip: 5,
        TotalAmount: 255,
        date: new Date().toISOString(),
      },
      expenseItemData: [
        {
          itemName: "Pen",
          quantity: 5,
          amount: 50,
        },
      ],
    });
  
    expect(seedResponse.status).toBe(201);
    const expenseId = seedResponse.body.savedExpense._id;
  
    // Step 2: Delete the seeded expense
    const deleteResponse = await request(app).delete(`/api/expense/deleteExpense/${expenseId}`);
  
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty("message", "Expense deleted successfully!");
  
    // Step 3: Confirm it's really gone (optional, but good)
    const confirmResponse = await request(app).get(`/api/expense/getexpense/${expenseId}`);
    expect(confirmResponse.status).toBe(404);
  });
  
  it("should delete an existing expense item", async () => {
    // Create expense with item
    const seedResponse = await request(app).post("/api/expense/newExpense").send({
      expenseBillData: {
        user: "67ec4bb5cd0dcecc76446ec5",
        store: "ItemDeleteMart",
        amount: 120,
        CardType: "Visa",
        currency: "USD",
        tip: 0,
        TotalAmount: 120,
        date: new Date().toISOString(),
      },
      expenseItemData: [
        {
          itemName: "Marker",
          quantity: 1,
          amount: 120,
        },
      ],
    });
  
    expect(seedResponse.status).toBe(201);
    const expenseItemId = seedResponse.body.savedExpenseItem[0]._id;
  
    // Try to delete the item
    const deleteResponse = await request(app).delete(`/api/expense/deleteExpenseItem/${expenseItemId}`);
  
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty("message", "Expense Item deleted successfully!");
    expect(deleteResponse.body.deletedExpenseItem).toMatchObject({ acknowledged: true, deletedCount: 1 });
  });
  
  