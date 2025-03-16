import DebtBill from "../model/DebtBill.js";
import DebtItem from "../model/DebtItem.js";

export const calculateAutoDueAmounts = async (billId) => {
    const debtBill = await DebtBill.findById(billId).populate('participant.person').exec();
    const debtItems = await DebtItem.find({ BillId: billId }).populate('borrower.person').exec();

    const participantDueMap = new Map();

    debtItems.forEach(item => {
        const borrowerCount = item.borrower.length;
        const amountPerBorrower = item.amount / borrowerCount;

        item.borrower.forEach(borrower => {
            borrower.due = amountPerBorrower;
            participantDueMap.set(borrower.person._id.toString(), amountPerBorrower);
        });
    });

    debtBill.participant.forEach(participant => {
        if (participantDueMap.has(participant.person._id.toString())) {

            participant.due = participantDueMap.get(participant.person._id.toString()) + participant.due;
        }
    });

    await Promise.all(debtItems.map(item => item.save()));
    await debtBill.save();
    return debtBill;
};

export const processPayment = async (payerId, payeeId, amount) => {
    const debtBills = await DebtBill.find({
        "participant.person": payerId,
        lender: payeeId,
        status: { $in: ["not paid", "partially paid"] }
    }).sort({ createdAt: 1 }).exec();

    let remainingAmount = amount;

    for (const bill of debtBills) {
        const debtItems = await DebtItem.find({ BillId: bill._id }).exec();

        for (const item of debtItems) {
            const borrower = item.borrower.find(b => b.person.toString() === payerId.toString());

            if (borrower && remainingAmount > 0) {
                const amountToPay = Math.min(borrower.due, remainingAmount);
                borrower.paid += amountToPay;
                borrower.due -= amountToPay;
                remainingAmount -= amountToPay;

                if (borrower.due === 0) {
                    borrower.due = 0;
                }

                await item.save();
            }
        }

        const participant = bill.participant.find(p => p.person.toString() === payerId.toString());
        if (participant) {
            participant.paid += amount - remainingAmount;
            participant.due -= amount - remainingAmount;

            if (participant.due === 0) {
                participant.due = 0;
            }

            if (bill.participant.every(p => p.due === 0)) {
                bill.status = "paid";
            } else if (bill.participant.some(p => p.due > 0 && p.paid > 0)) {
                bill.status = "partially paid";
            }

            await bill.save();
        }

        if (remainingAmount === 0) {
            break;
        }
    }

    return { remainingAmount };
};
