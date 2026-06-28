// shared/transaction.ts
import api from "../../lib/axios"; // your axios instance

export const getTransactionHistory = () => api.get("/transactions/history");

export const initiateTransaction = (data: {
  mockTestId: string;
  amount: number;
}) => api.post("/transactions/initiate", data);

export const confirmDummyTransaction = (transactionId: string) =>
  api.patch(`/transactions/confirm/${transactionId}`);