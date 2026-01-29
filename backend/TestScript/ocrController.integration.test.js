// File: TestScript/ocrController.integration.test.js

import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import ocrRoutes from "../routes/ocrRoute.js";

// Load environment variables
dotenv.config();

// Force-set credentials path for the test environment
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
  __dirname,
  "../api_key/sustained-path-455020-s8-f558239aff87.json"
);

// Initialize express app with OCR routes
const app = express();
app.use(bodyParser.json());
app.use("/api/ocr", ocrRoutes);

// Set image path to test
const imagePath = path.resolve(__dirname, "../uploads/Test.jpg");

describe("OCR Controller Integration Test", () => {
  it("should perform OCR and return parsed data from a receipt image", async () => {
    expect(fs.existsSync(imagePath)).toBe(true);

    const res = await request(app)
      .post("/api/ocr/performOCR")
      .attach("image", imagePath);

    if (res.status !== 200) {
      console.error("OCR error status:", res.status);
      console.error("OCR error body:", JSON.stringify(res.body, null, 2));
    }

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("parseddata");
    expect(typeof res.body.parseddata).toBe("object");
    expect(Object.keys(res.body.parseddata).length).toBeGreaterThan(0);
  });

  it("should return 400 if no image is uploaded", async () => {
    const res = await request(app).post("/api/ocr/performOCR");

    if (res.status !== 400) {
      console.error("Unexpected status:", res.status);
      console.error("Response:", res.body);
    }

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/no file uploaded/i);
  });
});
