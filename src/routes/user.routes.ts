import express from "express";
import {
  createUserHandler,
  deleteUserByIdController,
  getAllClientsController,
  getAllEmployeeController,
  getAllUserController,
  getUserByIdController,
  updateUserByIdController,
  getUserStatisticData,
} from "../controller/user.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "../schema/user.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

// router.post(
//   "/api/users/verify/:id/:verificationCode",
//   validateResource(verifyUserSchema),
//   verifyUserHandler
// );

// router.post(
//   "/api/users/forgotpassword",
//   validateResource(forgotPasswordSchema),
//   forgotPasswordHandler
// );

// router.post(
//   "/api/users/resetpassword/:id/:passwordResetCode",
//   validateResource(resetPasswordSchema),
//   resetPasswordHandler
// );

router.get("/api/all/user/employee", auth, getAllEmployeeController);

router.get("/api/all/user/clients", auth, getAllClientsController);

//get specific user
router.get("/api/current/user/:id", auth, getUserByIdController);
router.post("/api/all/user/", auth, getAllUserController);

router.get("/api/customers-statistic", auth, getUserStatisticData);

//update specific user
router.put(
  "/api/current/user/:id",
  auth,
  updateUserByIdController
);

//delete specific user
router.delete(
  "/api/current/user/:id",
  auth,
  deleteUserByIdController
  );


export default router;
