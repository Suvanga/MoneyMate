import DebtService from "../services/DebtService.js";

const createDebt = async (req, res) => {
    const { debtBillData, debtItemData } = req.body;

    if (!debtBillData?.name || !debtBillData?.amount || !debtBillData?.lender || !debtBillData?.participant) {
        return res.status(400).json({
            message: "Please enter all required Bill fields!"
        });
    }

    if (Array.isArray(debtBillData.participant) && debtBillData.participant.length < 1) {
        return res.status(400).json({
            message: "Please add at least one participants!"
        });
    }

    if (!Array.isArray(debtItemData) || debtItemData.length < 1) {
        return res.status(400).json({
            message: "Please add at least one item!"
        });
    }

    for (const item of debtItemData) {
        if (!item?.item || !item?.amount) {
            return res.status(400).json({
                message: "Please enter all required Item fields!"
            });
        }
    }

    try {
        const { savedDebt, savedDebtItem } = await DebtService.createDebt(debtBillData, debtItemData);

        //right now we can only divide equally
        await DebtService.calculateDueAmounts(savedDebt._id);

        const updatedDebt = await DebtService.findDebtById(savedDebt._id);
        //Need to handle this
        // Handle the scenario where person1 owes money to person2 and person1 adds a bill with person2 as the borrower
        const lenderId = debtBillData.lender;
        const borrowersArray = debtBillData.participant;

        for (const borrower of borrowersArray) {
            const amount = updatedDebt.participant.find(p => p.person.toString() === borrower.person.toString())?.due || 0;

            const existingDebts = await DebtService.findPendingDebtsByLenderAndBorrower(borrower.person, lenderId);
            if (existingDebts.length > 0) {
                for (const debt of existingDebts) {
                    if (debt._id.toString() !== savedDebt._id.toString()) {

                        await DebtService.adjustDebtsForNewExpense(lenderId, borrower.person, amount);

                        /* For reference: Comment previous and uncomment below if not working */
                        // await DebtService.processPayment(lenderId, borrower.person, debt.amount);
                        console.log("Processed payment for debt: ");
                    }
                }
            }
        }

        return res.status(201).json({ savedDebt, savedDebtItem });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while creating the Debt!"
        });
    }
};

const getDebtById = async (req, res) => {
    const debtId = req.params.debtId.trim();

    if (!debtId) {
        return res.status(400).json({
            message: "Please enter Debt Id!"
        });
    }

    try {
        const debt = await DebtService.findDebtById(debtId);
        if (!debt) {
            return res.status(404).json({
                message: "Debt not found!"
            });
        }
        return res.status(200).json(debt);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Debt!"
        });
    }
};

const getDebtItemsByDebtId = async (req, res) => {
    const debtId = req.params.debtId.trim();

    if (!debtId) {
        return res.status(400).json({
            message: "Please enter Debt Id!"
        });
    }

    try {
        const debtItems = await DebtService.findDebtItemsByDebtId(debtId);
        return res.status(200).json(debtItems);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Debt Items!"
        });
    }
};

const getDebtByMultipleDebtIds = async (req, res) => {
    const debtIds = req.query.debtIds?.split(',');

    if (!Array.isArray(debtIds) || debtIds.length < 1) {
        return res.status(400).json({
            message: "Please enter Debt Ids!"
        });
    }

    try {
        const debtArray = await DebtService.findDebtByMultipleDebtIds(debtIds);
        return res.status(200).json(debtArray);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Debt Items!"
        });
    }
};

const getDebtsByLender = async (req, res) => {
    const lenderId = req.params.lenderId;

    if (!lenderId) {
        return res.status(400).json({
            message: "Please enter Lender Id!"
        });
    }

    try {
        const debts = await DebtService.findDebtsByLender(lenderId);
        return res.status(200).json(debts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Debts!"
        });
    }
};

const getPendingDebtsByLender = async (req, res) => {
    const lenderId = req.params.lenderId;

    if (!lenderId) {
        return res.status(400).json({
            message: "Please enter Lender Id!"
        });
    }

    try {
        const debts = await DebtService.findPendingDebtsByLender(lenderId);
        return res.status(200).json(debts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Debts!"
        });
    }
};

const getDebtsWithConnectedUser = async (req, res) => {
    const { lenderId, borrowerId } = req.query;

    if (!lenderId || !borrowerId) {
        return res.status(400).json({
            message: "Please enter Lender and Borrower!"
        });
    }

    try {
        const debts = await DebtService.findDebtsWithConnectedUser(lenderId, borrowerId);
        return res.status(200).json(debts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Debts!"
        });
    }
};

const getPendingDebtsWithConnectedUser = async (req, res) => {
    const { lenderId, borrowerId } = req.query;

    if (!lenderId || !borrowerId) {
        return res.status(400).json({
            message: "Please enter Lender and Borrower!"
        });
    }

    try {
        const debts = await DebtService.findPendingDebtsWithConnectedUser(lenderId, borrowerId);
        return res.status(200).json(debts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Debts!"
        });
    }
};

const getPendingDebtsByLenderAndBorrower = async (req, res) => {
    const { lenderId, borrowerId } = req.query;

    if (!lenderId || !borrowerId) {
        return res.status(400).json({
            message: "Please enter Lender and Borrower!"
        });
    }

    try {
        const debts = await DebtService.findPendingDebtsByLenderAndBorrower(lenderId, borrowerId);
        let totalDue = 0;
        let ConnectedName = "";
        let debtType = "";

        debts.forEach(debt => {
            debt.participant.forEach(participant => {
                if (participant.person._id.toString() === borrowerId.toString()) {
                    totalDue += participant.due;
                    ConnectedName = participant.person.firstname;
                }
                if (participant.person._id.toString() === lenderId.toString()) {
                    totalDue -= participant.due;
                    ConnectedName = debt.lender.firstname;
                }
            });
        });
        if (totalDue > 0) {
            debtType = "Owes you";
        }
        else if (totalDue < 0) {
            debtType = "You owe";
        }

        else {
            debtType = "settled";
        }

        return res.status(200).json({ debts, totalDue, ConnectedName, debtType });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Debts!"
        });
    }
};

const getAllDebtsByLenderAndBorrower = async (req, res) => {
    const { lenderId, borrowerId } = req.query;

    if (!lenderId || !borrowerId) {
        return res.status(400).json({
            message: "Please enter Lender and Borrower!"
        });
    }

    try {
        const debts = await DebtService.findDebtsByLenderAndBorrower(lenderId, borrowerId);
        let totalDue = 0;
        let ConnectedName = "";
        let debtType = "";

        debts.forEach(debt => {
            debt.participant.forEach(participant => {
                if (participant.person._id.toString() === borrowerId.toString()) {
                    totalDue += participant.due;
                    ConnectedName = participant.person.firstname;
                }
                if (participant.person._id.toString() === lenderId.toString()) {
                    totalDue -= participant.due;
                    ConnectedName = debt.lender.firstname;
                }
            });
        });
        if (totalDue > 0) {
            debtType = "Owes you";
        }
        else if (totalDue < 0) {
            debtType = "You owe";
        }

        else {
            debtType = "settled";
        }

        return res.status(200).json({ debts, totalDue, ConnectedName, debtType });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the Debts!"
        });
    }
};
const getPendingDebtsByLenderAndBorrowers = async (req, res) => {
    const lenderId = req.params.lenderId;
    const borrowerIds = req.body.borrowerIds;

    if (!lenderId || !Array.isArray(borrowerIds) || borrowerIds.length === 0) {
        return res.status(400).json({
            message: "Please provide lenderId and a non-empty array of borrowerIds.",
        });
    }

    try {
        const result = await Promise.all(
            borrowerIds.map(async (borrowerId) => {
                const debts = await DebtService.findPendingDebtsByLenderAndBorrower(lenderId, borrowerId);
                let totalDue = 0;
                let ConnectedName = "";
                let debtType = "";

                debts.forEach((debt) => {
                    debt.participant.forEach((participant) => {
                        if (participant.person._id.toString() === borrowerId.toString()) {
                            totalDue += participant.due;
                            ConnectedName = participant.person.firstname;
                        }
                    });
                });

                const debtsOwed = await DebtService.findPendingDebtsByLenderAndBorrower(borrowerId, lenderId);

                debtsOwed.forEach((debt) => {
                    if (debt.lender._id.toString() === borrowerId.toString()) {
                        debt.participant.forEach((participant) => {
                            if (participant.person._id.toString() === lenderId.toString()) {
                                totalDue -= participant.due;
                                ConnectedName = debt.lender.firstname;
                            }
                        });
                    }
                });



                if (totalDue > 0) {
                    debtType = "Owes you";
                }
                else if (totalDue < 0) {
                    debtType = "You owe";
                }

                else {
                    debtType = "settled";
                }

                return {
                    ConnectedId: borrowerId,
                    ConnectedName,
                    debtType,
                    totalDue,
                    debts,
                    debtsOwed
                };
            })
        );

        return res.status(200).json({ result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while fetching the debts.",
        });
    }
};


const updateDebt = async (req, res) => {
    const debtId = req.params.debtId;
    const updatedData = req.body;

    if (!debtId) {
        return res.status(400).json({
            message: "Please enter Debt Id!"
        });
    }

    if (!updatedData) {
        return res.status(400).json({
            message: "Please enter new data!"
        });
    }

    try {
        const updatedDebt = await DebtService.updateDebt(debtId, updatedData);
        return res.status(200).json(updatedDebt);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while updating the Debt!"
        });
    }
};

const deleteDebt = async (req, res) => {
    const debtId = req.params.debtId.trim();

    if (!debtId) {
        return res.status(400).json({
            message: "Please enter Debt Id!"
        });
    }

    try {
        await DebtService.deleteDebt(debtId);
        return res.status(200).json({
            message: "Debt deleted successfully!"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while deleting the Debt!"
        });
    }
};

const processPayment = async (req, res) => {
    const { payerId, payeeId, amount } = req.body;

    if (!payerId || !payeeId || !amount || amount <= 0) {
        return res.status(400).json({
            message: "Please provide valid payer ID, payee ID, and amount!"
        });
    }

    try {
        const result = await DebtService.processPayment(payerId, payeeId, amount);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "There was an error while processing the payment!"
        });
    }
};

export default {
    createDebt,
    getDebtById,
    getDebtItemsByDebtId,
    getDebtByMultipleDebtIds,
    getDebtsByLender,
    getPendingDebtsByLender,
    getDebtsWithConnectedUser,
    getPendingDebtsWithConnectedUser,
    getPendingDebtsByLenderAndBorrower,
    getPendingDebtsByLenderAndBorrowers,
    getAllDebtsByLenderAndBorrower,
    updateDebt,
    deleteDebt,
    processPayment
};