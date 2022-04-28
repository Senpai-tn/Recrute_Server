var express = require("express");
var User = require("../models/User");
var router = express.Router();
const Offer = require("../models/Offer");
const { sendMail } = require("../Mailer");
const { createdOffer } = require("../public/Mail/accepted");

/* GET users listing. */
router.get("/", async (req, res) => {
  var offers = await Offer.find({
    //deletedAt: null,
    //state: { $nin: ["DRAFT", "SENT", "REFUSED"] },
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
        user.offers = [...user.offers, savedOffer];
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
  offer.state = req.body.state;
  offer.save((error, savedOffer) => {
    if (error != null) {
      res.send(error);
    } else {
      res.send(savedOffer);
    }
  });
});
module.exports = router;
