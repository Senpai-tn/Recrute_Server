var express = require("express");
var User = require("../models/User");
var router = express.Router();
const Offer = require("../models/Offer");
const { sendMail } = require("../Mailer");
const { createdOffer } = require("../public/Mail/accepted");

/* GET users listing. */
router.get("/", async (req, res) => {
  var offers = await Offer.find({
    deletedAt: null,
    state: { $nin: ["DRAFT", "SENT", "REFUSED"] }, // not in
  });
  res.send(offers);
});

router.post("/", async (req, res) => {
  try {
    var user = await User.findById(req.body.user._id);
    var offer = new Offer(req.body.offer);

    await offer.save(async (error, savedOffer) => {
      if (error != null) {
        res.send(error);
      } else {
        user.offers = [...user.offers, savedOffer._id];
        await user.save(async (userError, savedUser) => {
          if (userError != null) {
            console.log(userError);
            res.send(userError);
          } else {
            const admins = await User.find({ role: "ADMIN" });
            if (savedOffer.state != "DRAFT") {
              sendMail(admins, "New offer", createdOffer(savedOffer));
            }
            res.send(savedUser);
          }
        });
      }
    });
  } catch (error) {
    console.log("Error");
  }
});

router.get("/get/:id", async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  res.send(offer);
});

router.put("/", async (req, res) => {
  var offer = await Offer.findById(req.body.id);
  var rh = await User.findById(offer.RH);
  req.body.state != null ? (offer.state = req.body.state) : null;
  req.body.title != null ? (offer.title = req.body.title) : null;
  req.body.type != null ? (offer.type = req.body.type) : null;
  offer.save((error, savedOffer) => {
    if (error != null) {
      res.send(error);
    } else {
      res.send({ rh: rh, offer: savedOffer });
    }
  });
});
module.exports = router;
