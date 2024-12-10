import express from "express";
import {
    getActivityByIdController,
  getAllActivityController,
  createActivityController
} from "../controller/activity.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createAvarisSchema,
} from "../schema/avaris.schema";
import { auth } from "../middleware/auth";

const router = express.Router();


router.post(
    "/api/new/activity",
    createActivityController
  );


//get specific avari
router.get(
  "/api/current/activity/:id",
  auth,
  getActivityByIdController

);
router.get(
  "/api/all/activity/",
  auth,
  getAllActivityController

);


export default router;
