const express = require("express");

const router = express.Router();

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//import
const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
} = require("../controllers/product");

//routes
router.post("/product", authCheck, adminCheck, create);
router.post("/products", list);
router.get("/products/total", productsCount);
router.get("/products/:count", listAll);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);

//rating
router.put("/product/star/:productId", authCheck, productStar);

//related
router.get("/product/related/:productId", listRelated);

module.exports = router;
