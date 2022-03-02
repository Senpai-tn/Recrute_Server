const { randomInt } = require("crypto");
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/:type", async (req, res) => {
  var jsonData = require("../public/questions/" + req.params.type + ".json");
  var array = [];
  while (array.length < 5) {
    var x = randomInt(jsonData.length);
    if (array.indexOf(x) == -1) {
      array.push(x);
    }
  }
  var questions = [];
  array.map((value) => {
    questions.push(jsonData[value]);
  });
  res.send({ array: array, questions: questions });
});

module.exports = router;
