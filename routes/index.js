const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/register", async (req, res) => {
  var user = new User(req.body.user);
  const hashed = await bcrypt.hash(user.password, 10);
  user.password = hashed;
  var savedUser = await user.save();
  res.send(savedUser);
});

router.post("/login", async (req, res) => {
  var user = await User.findOne({ login: req.body.login });
  if (user == null) {
    res.status(404).send("not found");
  }
  var compare = await bcrypt.compare(req.body.password, user.password);
  if (!compare) {
    res.status(402).send("password error");
  } else if (user.deletedAt != null) {
    res.status(403).send("user deleted");
  } else {
    res.send(user);
  }
});

module.exports = router;
