// Package Import(s)
import express from "express";

// Function Import(s)
import { getProducts } from "../controllers/productController.js"
import { createProduct } from "../controllers/productController.js"
import { updateProduct } from "../controllers/productController.js"
import { deleteProduct } from "../controllers/productController.js"


const router = express.Router(); // Captures the Express Router functionality


/// RESTful API Endpoint(s) ///

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:id",updateProduct);
router.delete("/:id", deleteProduct);

export default router; // return the router responses