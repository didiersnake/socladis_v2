import express from "express";
import {
  createGroupHandler,
  deleteGroupByIdController,
  getGroupByIdController,
  updateGroupByIdController,
  getAllGroupController
} from "../controller/group.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createGroupSchema } from "../schema/group.shema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/groups",
  validateResource(createGroupSchema),
  createGroupHandler,
);

//get specific group
router.get(
  "/api/current/group/:id",
  auth,
  getGroupByIdController

);
router.get(
  "/api/all/groups/",
  auth,
  getAllGroupController

);

//update specific group
router.put(
  "/api/current/group/:id",
  auth,
  updateGroupByIdController
);

//delete specific group
router.delete(
  "/api/current/group/:id",
  auth,
  deleteGroupByIdController
  );


export default router;
