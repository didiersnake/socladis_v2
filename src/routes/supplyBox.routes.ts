import express from "express";
import {
  createSupplyBoxHandler,
  deleteSupplyBoxsByIdController,
  getSupplyBoxsByIdController,
  updateSupplyBoxsByIdController,
  getAllSupplyBoxsController,
  getAllSupplyBoxPaginated,
  getAllSupplyBoxByRange,
  getUserStatisticData,
} from "../controller/supplyBox.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createSupplyBoxSchema } from "../schema/supplyBox.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/supply/box",
  validateResource(createSupplyBoxSchema),
  createSupplyBoxHandler
);

//get specific avari
router.get("/api/current/supply/box/:id", auth, getSupplyBoxsByIdController);
router.get("/api/all/supply/boxUnpaginated", auth, getAllSupplyBoxsController);

router.get("/api/supplyBox/customers-statistic", auth, getUserStatisticData);


router.post("/api/all/supply/box-by-range/", auth, getAllSupplyBoxByRange);


router.post("/api/all/supply/box", auth, getAllSupplyBoxPaginated);

//update specific SupplyBox
router.put(
  "/api/current/supply/box/:id",
  auth,
  updateSupplyBoxsByIdController
);

//delete specific SupplyBox
router.delete(
  "/api/current/supply/box/:id",
  auth,
  deleteSupplyBoxsByIdController
  );


export default router;
