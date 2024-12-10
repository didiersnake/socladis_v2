import express from "express";
import {
  createSaleHandler,
  createSaleSecondHandler,
  deleteSaleByIdController,
  getSaleByIdController,
  updateSaleByIdController,
  getAllSaleController,
  generateRistourn,
  getAllSalesByRange
} from "../controller/sales.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createSalesSchema,
} from "../schema/sales.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/sales",
  validateResource(createSalesSchema),
  createSaleHandler
);

router.post(
  "/api/new/second/sales",
  validateResource(createSalesSchema),
  createSaleSecondHandler 
);

//get specific sale
router.get(
  "/api/current/sale/:id",
  auth,
  getSaleByIdController

);
router.post(
  "/api/all/sales/",
  auth,
  getAllSaleController

);

router.post("/api/all/sale-by-range/", auth, getAllSalesByRange);

router.post("/sales/export-ristourn", auth, generateRistourn);

//update specific sale
router.put(
  "/api/current/sale/:id",
  auth,
  updateSaleByIdController
);

//delete specific sale
router.delete(
  "/api/current/sales/:id",
  auth,
  deleteSaleByIdController
  );


export default router;
