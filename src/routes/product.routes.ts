import express from "express";
import {
  createProductHandler,
  deleteProductByIdController,
  getProductByIdController,
  updateProductByIdController,
  getAllProductController,
  getPaginatedProducts
} from "../controller/product.controller";
// import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createProductSchema,
} from "../schema/product.schema";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/api/new/products",
  validateResource(createProductSchema),
  createProductHandler
);

//get specific user
router.get(
  "/api/current/product/:id",
  auth,
  getProductByIdController

);
router.post(
  "/api/all/products/",
  auth,
  getPaginatedProducts

);

router.get("/api/all/productsUnpaginated/", auth, getAllProductController);

//update specific user
router.put(
  "/api/current/product/:id",
  auth,
  updateProductByIdController
);

//delete specific user
router.delete(
  "/api/current/product/:id",
  auth,
  deleteProductByIdController
  );


export default router;
