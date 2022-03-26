const express = require("express");
const Offer = require("../models/Offer");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("RH");
});

module.exports = router;
