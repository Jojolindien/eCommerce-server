const express = require("express");
const router = express.Router();

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//import
const { upload, remove } = require("../controllers/cloudinary");

//routes
router.post("/uploadImages", authCheck, adminCheck, upload);
router.post("/removeImage", authCheck, adminCheck, remove);

module.exports = router;
