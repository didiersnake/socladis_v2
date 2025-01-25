import express from "express";
import {
  createEmptyStoreHandler,
  deleteEmptyStoreByIdController,
  getEmptyStoreByIdController,
  updateEmptyStoreByIdController,
  getAllEmptyStoreController,
  getUserStatisticData,
  getAllEmptyStorePaginated,
  getAllEmptyStoreByRange,
} from "../controller/emptyStore.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createEmptySoreSchema } from "../schema/emptyStore.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/empty/stores",
  validateResource(createEmptySoreSchema),
  createEmptyStoreHandler
);

//get specific user
router.get("/api/current/empty/store/:id", auth, getEmptyStoreByIdController);
router.get(
  "/api/all/empty/stores-unpaginated/",
  auth,
  getAllEmptyStoreController
);

router.get("/api/empty/store/customers-statistic", auth, getUserStatisticData);

router.post("/api/all/store-empty-by-range/", auth, getAllEmptyStoreByRange);

router.post("/api/all/empty/stores", auth, getAllEmptyStorePaginated);

//update specific user
router.put(
  "/api/current/empty/store/:id",
  auth,
  updateEmptyStoreByIdController
);

//delete specific user
router.delete(
  "/api/current/empty/store/:id",
  auth,
  deleteEmptyStoreByIdController
  );


export default router;
