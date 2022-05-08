const express = require("express");
const { sendMail } = require("../Mailer");
const Offer = require("../models/Offer");
const router = express.Router();
const User = require("../models/User");
const { welcomeEmail, responseOffer } = require("../public/Mail/accepted");

router.get("/", async (req, res) => {
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
  const stat = await Offer.aggregate([
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
        stat: { $arrayToObject: "$data" },
        _id: 0,
      },
    },
  ]);

  var users = await User.find();
  res.send({ stat: stat, users: users });
});

router.put("/setrole", async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req.body.id);
  user.role = req.body.role;
  user.save(async (e, savedUser) => {
    if (e != null) {
      res.send(e);
    }
    var users = await User.find();
    res.send(users);
  });
});

router.delete("/delete", async (req, res) => {
  if (Array.isArray(req.body.cible)) {
    console.log(req.body.cible.length);
    var users = [];
    await Promise.all(
      req.body.cible.map(async (item) => {
        var user = await User.findById(item.id);
        user.deletedAt = new Date();
        users.push(await user.save());
      }),
    );
    var allUsers = await User.find();
    res.send(allUsers);
  } else {
    const user = await User.findById(req.body.cible.id);
    user.deletedAt = new Date();
    user.save(async (e, savedUser) => {
      if (e != null) {
        res.send(e);
      } else {
        var users = await User.find();
        res.send(users);
      }
    });
  }
});

router.get("/restore", async (req, res) => {
  var users = await User.find();
  var offers = await Offer.find();

  await Promise.all(
    users.map(async (item) => {
      var user = await User.findById(item.id);
      user.deletedAt = null;
      users.push(await user.save());
    }),
  );

  await Promise.all(
    offers.map(async (item) => {
      var offer = await Offer.findById(item.id);
      offer.deletedAt = null;
      offers.push(await offer.save());
    }),
  );
  res.send("restored");
});

router.put("/offer", async (req, res) => {
  var offer = await Offer.findById(req.body.id);
  offer.state = req.body.state;
  req.body.state != "DRAFT"
    ? offer.save((e, savedOffer) => {
        if (e != null) {
          res.send(e);
        } else {
          console.log(offer.RH.email);

          sendMail(
            offer.RH.email,
            "Response from admin about your offer",
            responseOffer(offer),
          );
          res.send(savedOffer);
        }
      })
    : res.send("not authorized");
});

router.put("/checkOffer", async (req, res) => {
  var offer = await Offer.findById(req.body.id);
  var rh = await User.findById(offer.RH);
  offer.state = req.body.state;
  offer.save((error, savedOffer) => {
    if (error != null) {
      res.send(error);
    } else {
      var index = rh.offers.findIndex((o) => o._id == req.body.id);
      rh.offers[index] = savedOffer;
      rh.save((e, savedRH) => {
        if (e != null) {
          res.send(e);
        } else {
          res.send(savedOffer);
        }
      });
    }
  });
});

router.get("/offers", async (req, res) => {
  var offers = await Offer.find({});
  res.send(offers);
});

module.exports = router;
