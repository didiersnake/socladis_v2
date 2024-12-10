import express from "express";
import {
  createRetoursHandler,
  deleteRetoursByIdController,
  getRetoursByIdController,
  updateRetoursByIdController,
  getAllRetoursController
} from "../controller/retour.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createRetourSchema,
} from "../schema/retour.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/retours",
  validateResource(createRetourSchema),
  createRetoursHandler
);

//get specific retour
router.get(
  "/api/current/retour/:id",
  auth,
  getRetoursByIdController

);
router.get(
  "/api/all/retours/",
  auth,
  getAllRetoursController

);

//update specific retour
router.put(
  "/api/current/retour/:id",
  auth,
  updateRetoursByIdController
);

//delete specific retour
router.delete(
  "/api/current/retour/:id",
  auth,
  deleteRetoursByIdController
  );


export default router;
