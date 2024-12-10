import express from "express";
import { LoginUserHandler } from "../controller/login.controller";
import validateResource from "../middleware/validateResource";
import { loginSessionSchema } from "../schema/login.schema";


const router = express.Router();


router.post(
    "/api/login",
    validateResource(loginSessionSchema),
    LoginUserHandler
  );

  export default router;