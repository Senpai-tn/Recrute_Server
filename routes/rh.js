const express = require("express");
const Offer = require("../models/Offer");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
  var offers = await Offer.find({});
  res.send(offers);
});

router.delete("/", async (req, res) => {
  var offer = await Offer.findById(req.body.idOffer);
  offer.deletedAt = new Date();
  var user = await User.findById(req.body.idUser);
  offer.save(async (e, savedOffer) => {
    if (e != null) {
      res.send(e);
    } else {
      user.offers = user.offers.filter((o) => {
        return o._id != req.body.idOffer;
      });
      //user.offers.push(savedOffer);
      const savedUser = await user.save();
      console.log(savedUser);
      res.send(savedUser);
    }
  });
});

router.get("/:id", async (req, res) => {
  var rh = await User.findById(req.params.id);

  var offers = await Offer.find({ RH: req.params.id });

  console.log(offers);
  res.send({ rh: rh, offers: offers });
});
module.exports = router;
