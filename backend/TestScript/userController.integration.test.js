import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "../routes/admin/User/userRoute.js"; // adjust if path is different
import "../services/mongodb.js"; // if you use centralized connection logic

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
  app = express();
  app.use(bodyParser.json());
  app.use("/api/user", userRoutes);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("UserController Integration Tests", () => {
  let createdUser;

  it("should create a new user", async () => {
    const res = await request(app).post("/api/user/newUser").send({
      username: "testuser123",
      email: "test123@example.com",
      firstname: "Test",
      lastname: "User"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("username", "testuser123");
    createdUser = res.body;
  });

  it("should get user by username", async () => {
    const res = await request(app).get("/api/user/getUserByUsername/testuser123");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "test123@example.com");
  });

  it("should get user by email", async () => {
    const res = await request(app).get("/api/user/getUserByEmail/test123@example.com");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("username", "testuser123");
  });

  it("should get user by ID", async () => {
    const getRes = await request(app).get("/api/user/getUserByUsername/testuser123");
    const id = getRes.body._id;

    const res = await request(app).get(`/api/user/getUserById/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("username", "testuser123");
  });

  it("should update user firstname and lastname", async () => {
    const getRes = await request(app).get("/api/user/getUserByUsername/testuser123");
    const userId = getRes.body._id;

    const res = await request(app).put(`/api/user/updateUser/${userId}`).send({
      firstname: "Updated",
      lastname: "UserName"
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User updated");
    expect(res.body.updateData.firstname).toBe("Updated");
  });

});

