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

router.get("/date", async (req, res) => {
  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const o = await Offer.aggregate([
    {
      $group: {
        _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year_month": 1 },
    },
    {
      $project: {
        _id: 0,
        count: 1,
        month_year: {
          $concat: [
            {
              $arrayElemAt: [
                monthsArray,
                {
                  $subtract: [
                    { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                    1,
                  ],
                },
              ],
            },
            "-",
            { $substrCP: ["$_id.year_month", 0, 4] },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        data: { $push: { k: "$month_year", v: "$count" } },
      },
    },
    {
      $project: {
        data: { $arrayToObject: "$data" },
        _id: 0,
      },
    },
  ]);
  res.send(o);
});

module.exports = router;
