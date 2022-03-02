var express = require("express");
var router = express.Router();
const User = require("../models/User");
/* GET users listing. */
router.get("/", async (req, res) => {
  var users = await User.find();
  console.log(users);
  res.send(users);
});

module.exports = router;
