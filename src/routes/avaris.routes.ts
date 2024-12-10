import express from "express";
import {
  createAvarisHandler,
  deleteAvarisByIdController,
  getAvarisByIdController,
  updateAvarisByIdController,
  getAllAvarisController,
  getAllAvarisControllerUnpaginated,
  getAllAvarisByRange
} from "../controller/avaris.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createAvarisSchema,
} from "../schema/avaris.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/avaris",
  validateResource(createAvarisSchema),
  createAvarisHandler
);

//get specific avari
router.get(
  "/api/current/avari/:id",
  auth,
  getAvarisByIdController

);
router.post(
  "/api/all/avaris/",
  auth,
  getAllAvarisController
);

router.post("/api/all/avaris-by-range/", auth, getAllAvarisByRange);

router.post("/api/all/avarisUnpaginated/", auth, getAllAvarisControllerUnpaginated);

//update specific avari
router.put(
  "/api/current/avari/:id",
  auth,
  updateAvarisByIdController
);

//delete specific avari
router.delete(
  "/api/current/avari/:id",
  auth,
  deleteAvarisByIdController
  );


export default router;
