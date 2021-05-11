const express = require('express');
const router = express.Router();
const apiController = require("../controller/apiController");

router.post("/getAssets", apiController.getAssets);

module.exports = router;