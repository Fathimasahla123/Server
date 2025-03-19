const express = require("express");
const router = express.Router();
const authContreoller = require("../controllers/authController");

router.post("/signup", authContreoller.signup);

router.post("/login", authContreoller.login);

module.exports = router;
