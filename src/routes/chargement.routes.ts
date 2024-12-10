import express from "express";
import {
  createChargeHandler,
  deleteChargeByIdController,
  getChargeByIdController,
  updateChargeByIdController,
  getAllChargeController
} from "../controller/chargement.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createChargementSchema,
} from "../schema/chargement.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/charge",
  validateResource(createChargementSchema),
  createChargeHandler
);

//get specific charge
router.get(
  "/api/current/charge/:id",
  auth,
  getChargeByIdController

);
router.get(
  "/api/all/charge/",
  auth,
  getAllChargeController

);

//update specific charge
router.put(
  "/api/current/charge/:id",
  auth,
  updateChargeByIdController
);

//delete specific charge
router.delete(
  "/api/current/charge/:id",
  auth,
  deleteChargeByIdController
  );


export default router;
