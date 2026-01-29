export interface UserInfo {
    _id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    connectedUsers: string[];
}

export interface UserInfoWithConnectedUsers {
    _id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    connectedUsers: connectedUsers[];
}

export interface connectedUsers {
    _id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    connectedUsers: connectedUsers[];
}

export interface expenseBill {
    _id: string;
    user: string;
    store: string;
    currency: string;
    CardType: string;
    amount: number;
    tip: number;
    TotalAmount: number;
    date: string;
}

export interface expenseBillItem {
    _id: string;
    itemName: string;
    quantity: number;
    amount: number;
}

export interface participantDebtBill {
    person: UserInfo;
    paid: number;
    due: number;
}

export interface debtBill {
    _id: string;
    name: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    lender: UserInfo;
    participant: participantDebtBill[];
    createdAt: string;
}

export interface debtBillItem {
    _id: string;
    BillId: string;
    item: string;
    amount: number;
    borrower: participantDebtBill[];
}

export interface debtSummary {
    ConnectedId: string;
    ConnectedName: string;
    debtType: string;
    totalDue: number;
    debts: debtBill[];
    debtsOwed: debtBill[];
}

export interface ImageFile {
    uri: string;
    type?: string;
    fileName?: string | null;
  }