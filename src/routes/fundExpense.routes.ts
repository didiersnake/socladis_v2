import express from "express";
import {
  createFundExpenseHandler,
  deleteFundExpensesByIdController,
  getFundExpensesByIdController,
  updateFundExpensesByIdController,
  getAllFundExpensesController,
  getAllFundExpensesPaginated,
  getAllFundExpenseByRange
} from "../controller/fundExpense.controller";
import validateResource from "../middleware/validateResource";
import {
  createFundExpenseSchema,
} from "../schema/fundExpense.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/fund/expense",
  validateResource(createFundExpenseSchema),
  createFundExpenseHandler
);

//get specific FundExpense
router.get(
  "/api/current/fund/expense/:id",
  auth,
  getFundExpensesByIdController

);
router.get(
  "/api/all/fund/expensesUnpaginated",
  auth,
  getAllFundExpensesController

);
router.post("/api/all/fund/expenses-by-range", auth, getAllFundExpenseByRange);

router.post("/api/all/fund/expenses", auth, getAllFundExpensesPaginated);

//update specific FundExpense
router.put(
  "/api/current/fund/expense/:id",
  auth,
  updateFundExpensesByIdController
);

//delete specific FundExpense
router.delete(
  "/api/current/fund/expense/:id",
  auth,
  deleteFundExpensesByIdController
  );


export default router;
