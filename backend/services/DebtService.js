import DebtBill from "../model/DebtBill.js";
import DebtItem from "../model/DebtItem.js";
import { calculateAutoDueAmounts, processPayment } from "../utils/debtUtils.js";

class DebtService {
    static async createDebt(debtBillData, debtItemData) {
        try {
            const newDebt = new DebtBill(debtBillData);
            const savedDebt = await newDebt.save();

            const debtItemsWithBillId = debtItemData.map(item => ({
                ...item,
                BillId: savedDebt._id
            }));

            const savedDebtItem = await DebtItem.insertMany(debtItemsWithBillId);
            return { savedDebt, savedDebtItem };
        } catch (error) {
            console.error("Error creating debt:", error);
            throw error;
        }
    }

    static async findDebtById(debtId) {
        return DebtBill.findById(debtId).sort({ createdAt: -1 }).exec();
    }

    static async findDebtItemsByDebtId(debtBillId) {
        return DebtItem.find({ BillId: debtBillId }).exec();
    }

    static async findDebtByMultipleDebtIds(debtIds) {
        return DebtBill.find({ _id: { $in: debtIds } }).exec();
    }

    static async findDebtsByLender(lenderId) {
        try {
            return DebtBill.find({
                $or: [
                    { lender: lenderId },
                    { "participant.person": lenderId }
                ]
            }).sort({ createdAt: -1 }).exec();
        } catch (error) {
            console.error("Error finding debts by lender:", error);
            throw error;
        }
    }

    static async findPendingDebtsByLender(lenderId) {
        return DebtBill.find({
            $and: [
                { $or: [{ lender: lenderId }, { "participant.person": lenderId }] },
                { $or: [{ status: "not paid" }, { status: "partially paid" }] }
            ]
        }).sort({ createdAt: -1 }).exec();
    }

    static async findDebtsByLenderAndBorrower(lenderId, borrowerId) {
        return DebtBill.find({
            $and: [
                { lender: lenderId },
                { "participant.person": borrowerId },
                { $or: [{ status: "not paid" }, { status: "partially paid" }] }
            ]
        }).sort({ createdAt: -1 }).exec();
    }

    static async findDebtsWithConnectedUser(lenderId, borrowerId) {
        return DebtBill.find({
            $and: [
                { $or: [{ lender: lenderId }, { "participant.person": lenderId }] },
                { $or: [{ lender: borrowerId }, { "participant.person": borrowerId }] }
            ]
        }).sort({ createdAt: -1 }).exec();
    }

    static async findPendingDebtsWithConnectedUser(lenderId, borrowerId) {
        return DebtBill.find({
            $and: [
                { $or: [{ lender: lenderId }, { "participant.person": lenderId }] },
                { $or: [{ lender: borrowerId }, { "participant.person": borrowerId }] },
                { $or: [{ status: "not paid" }, { status: "partially paid" }] }
            ]
        }).sort({ createdAt: -1 }).exec();
    }

    static async updateDebt(debtId, updatedData) {
        const updatedDebt = await DebtBill.findByIdAndUpdate(debtId, updatedData, { new: true }).exec();
        if (updatedData.items) {
            for (const item of updatedData.items) {
                await DebtItem.findByIdAndUpdate(item._id, item, { new: true }).exec();
            }
        }
        return { updatedDebt, updatedData };
    }

    static async deleteDebt(debtId) {
        await DebtItem.deleteMany({ BillId: debtId }).exec();
        return DebtBill.deleteOne({ _id: debtId }).exec();
    }

    static async calculateDueAmounts(billId) {
        return calculateAutoDueAmounts(billId);
    }

    static async processPayment(payerId, payeeId, amount) {
        return processPayment(payerId, payeeId, amount);
    }
}

export default DebtService;