import express from "express";
import {
  createAchatsHandler,
  deleteAchatsByIdController,
  getAchatsByIdController,
  updateAchatsByIdController,
  getAllAchatController,
  getAllAchatsControllerUnpaginated,
  getUserStatisticData,
  getAllAchatByRange,
} from "../controller/achat.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createAchatSchema } from "../schema/achat.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/achats",
  validateResource(createAchatSchema),
  createAchatsHandler
);

//get specific Achat
router.get("/api/current/achat/:id", auth, getAchatsByIdController);
router.get(
  "/api/all/achatsUnpaginated/",
  auth,
  getAllAchatsControllerUnpaginated
);

router.get("/api/achat/customers-statistic", auth, getUserStatisticData);

router.post("/api/all/achats/", auth, getAllAchatController);

router.post("/api/all/achats-by-range/", auth, getAllAchatByRange);

//update specific Achat
router.put(
  "/api/current/achat/:id",
  auth,
  updateAchatsByIdController
);

//delete specific Achat
router.delete(
  "/api/current/achat/:id",
  auth,
  deleteAchatsByIdController
  );


export default router;
