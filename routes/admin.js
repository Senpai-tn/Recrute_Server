const express = require("express");
const Offer = require("../models/Offer");
const nodemailer = require("nodemailer");
const router = express.Router();
const User = require("../models/User");

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

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "recruteemail@gmail.com",
      pass: "Recrute2022",
    },
  });

  let mailOptions = {
    from: "recruteOffer@gmail.com",
    to: "recruteemail@gmail.com,khaledsahli36@gmail.com",
    subject: `Test ${new Date()}`,
    text: "Hello World!",
  };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return console.log(error.message);
  //   }
  //   console.log("success");
  // });

  var users = await User.find();
  res.send({ stat: stat, users: users });
});

module.exports = router;
