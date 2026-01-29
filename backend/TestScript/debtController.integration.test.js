import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import bodyParser from "body-parser";
import debtRoutes from "../routes/debt/debtRoute.js";
import "../services/mongodb.js";
import User from "../model/User.js"; 

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  app = express();
  app.use(bodyParser.json());
  app.use("/api/debt", debtRoutes);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("DebtController Integration Tests", () => {
  const lenderId = "67ec4bb5cd0dcecc76446ec5";
  const borrowerId = "67eff137cb2b3fb5f4f19f67";

  it("should create a new debt", async () => {
    // Create lender and borrower in test DB
    const lender = await User.create({
      username: "lenderTestUser",
      email: "lender@example.com",
      firstname: "Lender",
      lastname: "Tester"
    });
  
    const borrower = await User.create({
      username: "borrowerTestUser",
      email: "borrower@example.com",
      firstname: "Borrower",
      lastname: "Tester"
    });
  
    // Use their real ObjectIds now
    const response = await request(app).post("/api/debt/newDebt").send({
      debtBillData: {
        name: "Dinner at Everest Bistro",
        amount: 90,
        currency: "USD",
        description: "Shared dinner on Friday",
        lender: lender._id.toString(),
        participant: [
          {
            person: borrower._id.toString(),
            paid: 0,
            due: 45
          }
        ]
      },
      debtItemData: [
        {
          item: "Pizza and drinks",
          amount: 90,
          currency: "USD",
          borrower: [
            {
              person: borrower._id.toString(),
              paid: 0,
              due: 45
            }
          ]
        }
      ]
    });
  
    expect(response.status).toBe(201);
    expect(response.body.savedDebt).toBeDefined();
    expect(response.body.savedDebtItem.length).toBe(1);
  });
  

it("should return 400 if required bill fields are missing", async () => {
  // Create only borrower (or both users if needed for structure)
  const borrower = await User.create({
    username: "missingLenderBorrower",
    email: "missinglender@example.com",
    firstname: "Missing",
    lastname: "Lender"
  });

  const response = await request(app).post("/api/debt/newDebt").send({
    debtBillData: {
      name: "Dinner at Everest Bistro",
      amount: 90,
      currency: "USD",
      description: "Shared dinner on Friday",
      // lender is intentionally omitted here to trigger 400 error
      participant: [
        {
          person: borrower._id.toString(),
          paid: 0,
          due: 45
        }
      ]
    },
    debtItemData: [
      {
        item: "Pizza and drinks",
        amount: 90,
        currency: "USD",
        borrower: [
          {
            person: borrower._id.toString(),
            paid: 0,
            due: 45
          }
        ]
      }
    ]
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toMatch(/required Bill fields/i);
});



it("should get a debt by ID", async () => {
  // Create test lender and borrower
  const lender = await User.create({
    username: "lenderTestUser2",
    email: "lender2@example.com",
    firstname: "Lender",
    lastname: "Tester"
  });

  const borrower = await User.create({
    username: "borrowerTestUser2",
    email: "borrower2@example.com",
    firstname: "Borrower",
    lastname: "Tester"
  });

  // Create a debt entry
  const creation = await request(app).post("/api/debt/newDebt").send({
    debtBillData: {
      name: "Test Rent",
      amount: 500,
      currency: "USD",
      description: "Monthly rent split",
      lender: lender._id.toString(),
      participant: [
        {
          person: borrower._id.toString(),
          paid: 0,
          due: 250
        }
      ]
    },
    debtItemData: [
      {
        item: "Rent",
        amount: 500,
        currency: "USD",
        borrower: [
          {
            person: borrower._id.toString(),
            paid: 0,
            due: 250
          }
        ]
      }
    ]
  });

  const debtId = creation.body.savedDebt._id;

  // Fetch and assert the created debt
  const response = await request(app).get(`/api/debt/getDebt/${debtId}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("_id", debtId);
});


  it("should return 404 for missing debt ID on getDebtById", async () => {
    const response = await request(app).get("/api/debt/getDebt/");
    expect(response.status).toBe(404);
  });
});

