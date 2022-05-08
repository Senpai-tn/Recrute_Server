var express = require("express");
const Offer = require("../models/Offer");
var router = express.Router();
const User = require("../models/User");
const ObjectId = require("mongoose").mongo.ObjectId;

/* GET users listing. */
router.get("/", async (req, res) => {
  var users = await User.find();
  console.log(users);
  res.send(users);
});

const checkOffer = (user, offer) => {
  var result;
  offer.liked.map((u) => {
    if (u === user._id.toString()) {
      result = true;
    }
  });
  console.log(result == true);
  return result == true;
};

router.post("/like", async (req, res) => {
  var offer = await Offer.findById(req.body.idOffer);
  var user = await User.findById(req.body.user._id);
  user.likes = req.body.user.likes;
  if (checkOffer(user, offer)) {
    offer.liked = offer.liked.filter((l) => {
      return l !== user._id.toString();
    });
  } else {
    offer.liked.push(user.id);
  }
  offer.save((e, savedOffer) => {
    if (e != null) {
      res.send(e);
    } else {
      user.save((error, savedUser) => {
        if (error != null) {
          res.send(error);
        } else {
          res.send({ user: savedUser, offer: savedOffer });
        }
      });
    }
  });
});

router.put("/", async (req, res) => {
  var user = await User.findById(req.body.id);
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.login = req.body.login;
  user.save((error, savedUser) => {
    if (error != null) {
      res.send(error);
    } else {
      res.send(savedUser);
    }
  });
});

module.exports = router;
