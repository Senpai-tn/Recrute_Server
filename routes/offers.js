var express = require("express");
var User = require("../models/User");
var router = express.Router();
const Offer = require("../models/Offer");

/* GET users listing. */
router.get("/", async (req, res) => {
  var offers = await Offer.find({ deletedAt: null });
  res.send(offers);
});

router.post("/", async (req, res) => {
  var offer = new Offer(req.body.offer);
  await offer.save(async (error, savedOffer) => {
    if (error != null) {
      res.send(error);
    }
    var user = await User.findById(req.body.user._id);
    user.offers = [...user.offers, savedOffer];
    await user.save((e, savedUser) => {
      if (e != null) {
        res.send(e);
      }
      res.send({ user: savedUser, offer: savedOffer });
    });
  });
});

router.get("/get/:id", async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  res.send(offer);
});

module.exports = router;
