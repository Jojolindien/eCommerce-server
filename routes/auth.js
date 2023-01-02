const express = require("express");

const router = express.Router();

//import
const { createOrUpdateUser, home } = require("../controllers/auth");

router.get("/", home);

router.get("/create-or-update-user", createOrUpdateUser);

module.exports = router;
