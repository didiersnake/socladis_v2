import express from "express";
import {
  createStockHandler,
  deleteStockByIdController,
  getStockByIdController,
  updateStockByIdController,
  getAllStockController,
  getPaginatedStock
} from "../controller/stock.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createStockSchema,
} from "../schema/stock.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/stocks",
  validateResource(createStockSchema),
  createStockHandler
);

//get specific user
router.get(
  "/api/current/stock/:id",
  auth,
  getStockByIdController

);
router.get(
  "/api/all/stocks-unpaginated/",
  auth,
  getAllStockController

);

router.post("/api/all/stocks/", auth, getPaginatedStock);

//update specific user
router.put(
  "/api/current/stock/:id",
  auth,
  updateStockByIdController
);

//delete specific user
router.delete(
  "/api/current/stock/:id",
  auth,
  deleteStockByIdController
  );


export default router;
