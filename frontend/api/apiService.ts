import { Platform } from "react-native";
import api from "./api";
import {UserInfo, expenseBill, expenseBillItem, ImageFile } from "@/api/apiInterface";

//User api

//create user info
export const CreateUser = async (userInfo: any) => {
  try {
    const response = await api.post(`/user/newUser`, userInfo);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      // Handle conflict error (user already exists)
      alert("User already exists.");
    }
    console.error("Error updating user info:", error);
    throw error;
  }
};

//get user
export const GetUser = async (email: string) => {
  try {
    const response = await api.get(`/user/getUserByEmail/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
};


//get user by username
export const GetUserByUsername = async (username: string) => {
  try {
    const response = await api.get(`/user/getUserByUsername/${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//get user by id
export const GetUserByUserId = async (id: string) => {
  try {
    const response = await api.get(`/user/getUserById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//update user
export const UpdateUser = async (userId: string, userInfo: UserInfo) => {
  try {
    const response = await api.put(`/user/updateUser/${userId}`, userInfo);
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

//transaction
//get expense by user
export const GetExpense = async (userId: string) => {
  try {
    const response = await api.get(`/expense/getexpenseByUser/${userId}`,);
    return response.data;
  } catch (error) {
    console.error("Error getting expense info:", error);
    throw error;
  }
};

//get expense by id
export const GetExpenseById = async (expenseId: string) => {
  try {
    const response = await api.get(`/expense/getexpense/${expenseId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting expense info:", error);
    throw error;
  }
};

//get expense items by id
export const GetExpenseItemsById = async (expenseId: string) => {
  try {
    const response = await api.get(`/expense/getexpenseItems/${expenseId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting expense info:", error);
    throw error;
  }
};

//update expense
export const UpdateExpense = async (expenseId: string, expenseInfo: any ) => {
  try {
    const response = await api.put(`/expense/updateExpense/${expenseId}`, expenseInfo);
    return response.data;
  } catch (error) {
    console.error("Error updating expense info:", error);
    throw error;
  }
}
//create expense
export const CreateExpense = async (expenseBillData: any, expenseItemData: any) => {
  try {
    const response = await api.post(`/expense/newExpense`, {expenseBillData, expenseItemData});
    return response.data;
  } catch (error) {
    console.error("Error creating expense info:", error);
    throw error;
  }
}

//Debt

//create debt
export const CreateDebt = async (debtBillData: any, debtItemData:any) => {
  try {
    const response = await api.post(`/debt/newDebt`, {debtBillData, debtItemData});
    return response.data;
  } catch (error) {
    console.error("Error creating debt info:", error);
    throw error;
  }
}

//get debt by users
export const GetDebtWithAllConnectedUser = async (userId: string, borrowerIds: JSON) => {  
  try {
    const response = await api.post(`/debt/getByLenderAndBorrowers/${userId}`, {borrowerIds});
    return response.data;
  } catch (error) {
    console.error("Error getting debt info:", error);
    throw error;
  }
}

//get debt with user
export const GetDebtWithUser = async (userId: string, borrowerId: string) => {
  try {
    const url =`/debt/getByLenderAndBorrower?lenderId=${userId}&borrowerId=${borrowerId}`
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error getting debt info:", error);
    throw error;
  }
}

//get all debts with user
export const GetAllDebtWithUser = async (userId: string, borrowerId: string) => {
  try {
    const url =`/debt/getAllByLenderAndBorrower?lenderId=${userId}&borrowerId=${borrowerId}`
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error getting debt info:", error);
    throw error;
  }
}

//get debts by Id
export const GetDebtById = async (debtId: string) => {
  try {
    const response = await api.get(`/debt/getDebt/${debtId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting debt info:", error);
    throw error;
  }
}

//get debt items by Id 
export const GetDebtItemsById = async (debtId: string) => {
  try {
    const response = await api.get(`/debt/getDebtItemsByDebtId/${debtId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting debt info:", error);
    throw error;
  }
}

//payment
export const CreatePayment = async (paymentData: any) => {
  try {
    const response = await api.post(`/debt/processPayment`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment info:", error);
    throw error;
  }
}

//ocr
export const uploadReceiptImage = async (imageFile: ImageFile) => {
  const formData = new FormData();

  // React Native FormData expects `uri`, `type`, and `name` for files
  formData.append('image', {
    uri: Platform.OS === 'ios' ? imageFile.uri.replace('file://', '') : imageFile.uri,
    type: imageFile.type || 'image/jpeg',
    name: imageFile.fileName || 'receipt.jpg',
  } as any); 

  try {
    const response = await api.post('/ocr/performOCR', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('OCR Upload Error:', error?.response?.data || error.message);
    throw error;
  }
};


//OpenAi
export const getFeedback = async (id: string) => {
  try {
    const response = await api.get(`/expense/getFeedbackByUser/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting feedback:", error);
    throw error;
  }
}