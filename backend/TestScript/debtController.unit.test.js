import mongoose from "mongoose";
import debtController from "../Controller/debtController.js";
import DebtService from "../services/DebtService.js";

// Mock the DebtService methods
jest.mock("../services/DebtService.js");

describe("Unit tests for debtController", () => {
  const lenderId = new mongoose.Types.ObjectId();
  const participantId = new mongoose.Types.ObjectId();
  const borrowerId = new mongoose.Types.ObjectId();

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing (createDebt)", async () => {
    const req = { body: {} };
    const res = mockRes();

    await debtController.createDebt(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
  });

  it("should call DebtService and return 201 on successful debt creation", async () => {
    const req = {
      body: {
        debtBillData: {
          name: "Dinner",
          amount: 200,
          lender: lenderId,
          participant: [{ person: participantId }],
        },
        debtItemData: [
          {
            item: "Pizza",
            amount: 200,
            borrower: [{ person: borrowerId }],
          },
        ],
      },
    };
    const res = mockRes();

    // Mock service responses
    DebtService.createDebt.mockResolvedValue({
      savedDebt: { _id: "123", name: "Dinner" },
      savedDebtItem: [{ _id: "456", item: "Pizza" }],
    });
    DebtService.calculateDueAmounts.mockResolvedValue();
    DebtService.findDebtById.mockResolvedValue({
      _id: "123",
      participant: [{ person: borrowerId, due: 100 }],
    });
    DebtService.findPendingDebtsByLenderAndBorrower.mockResolvedValue([]);

    await debtController.createDebt(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ savedDebt: expect.any(Object) })
    );
  });

  it("should return 400 if no debt ID is provided (getDebtById)", async () => {
    const req = { params: { debtId: " " } };
    const res = mockRes();

    await debtController.getDebtById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Please enter Debt Id!" });
  });

  it("should return 200 with debt data (getDebtById)", async () => {
    const req = { params: { debtId: "123" } };
    const res = mockRes();

    const mockDebt = { _id: "123", name: "Mock Debt" };
    DebtService.findDebtById.mockResolvedValue(mockDebt);

    await debtController.getDebtById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockDebt);
  });

  it("should update a debt and return 200 (updateDebt)", async () => {
    const req = {
      params: { debtId: "123" },
      body: { name: "Updated Name" },
    };
    const res = mockRes();

    const updatedDebt = { _id: "123", name: "Updated Name" };
    DebtService.updateDebt.mockResolvedValue(updatedDebt);

    await debtController.updateDebt(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedDebt);
  });

  it("should return 400 if no debtId is provided (deleteDebt)", async () => {
    const req = { params: { debtId: "" } };
    const res = mockRes();

    await debtController.deleteDebt(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Please enter Debt Id!" });
  });

  it("should delete a debt and return 200", async () => {
    const req = { params: { debtId: "123" } };
    const res = mockRes();

    DebtService.deleteDebt.mockResolvedValue();

    await debtController.deleteDebt(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Debt deleted successfully!",
    });
  });

  it("should process payment successfully (processPayment)", async () => {
    const req = {
      body: {
        payerId: "payer123",
        payeeId: "payee123",
        amount: 100,
      },
    };
    const res = mockRes();

    const paymentResult = { success: true };
    DebtService.processPayment.mockResolvedValue(paymentResult);

    await debtController.processPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(paymentResult);
  });

  it("should return 400 if payment info is missing", async () => {
    const req = {
      body: { payerId: null, payeeId: null, amount: 0 },
    };
    const res = mockRes();

    await debtController.processPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Please provide valid payer ID, payee ID, and amount!",
    });
  });
});
