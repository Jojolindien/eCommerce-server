const express = require("express");

const router = express.Router();

//middlewares
const { authCheck } = require("../middlewares/auth");

//import
const { createOrUpdateUser, home } = require("../controllers/auth");

router.get("/", home);

router.post("/create-or-update-user", authCheck, createOrUpdateUser);

module.exports = router;
