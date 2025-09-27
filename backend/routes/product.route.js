const express = require('express')
const router = express.Router();

const { getProducts, updateProduct, deleteProduct, createProduct } = require('../controllers/product.controller.js');

router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

module.exports = router;