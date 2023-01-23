const express = require("express");

const router = express.Router();

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//import
const { create, listAll, remove } = require("../controllers/product");

//routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll);
router.delete("/producr/:slug", authCheck, adminCheck, remove);

module.exports = router;
