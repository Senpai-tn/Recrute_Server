const { randomInt } = require("crypto");
var express = require("express");
const Exam = require("../models/Exam");
const Offer = require("../models/Offer");
const User = require("../models/User");
var router = express.Router();

/* GET questions */
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
    questions.push({
      id: jsonData[value - 1].id,
      question: jsonData[value - 1].question,
      answers: jsonData[value - 1].answers,
    });
  });
  res.send({ array: array, questions: questions });
});

// Validate Quiz
router.post("/", async (req, res) => {
  var answers = req.body.formData;
  var allQuestions = require("../public/questions/" + req.body.type + ".json");
  var questions = [];
  var finalResult = 0;
  const percent = 100 / req.body.array.length;
  req.body.array.map((i) => {
    questions.push(allQuestions[i - 1]);
  });
  answers.map((q) => {
    if (q.value == allQuestions[q.key - 1].correctAnswer) finalResult++;
  });
  var exam = new Exam();
  exam.type = req.body.type;
  exam.questions = questions;
  exam.answers = answers;
  exam.result = finalResult * percent;
  await exam.save(async (e, savedExam) => {
    if (e != null) {
      res.send(e);
    }
    var user = await User.findById(req.body.idUser);
    user.exams = [...user.exams, savedExam];
    var savedUser = await user.save();
    var oldOffer = await Offer.findById(req.body.idOffer);
    oldOffer.candidates = [
      ...oldOffer.candidates,
      { user: savedUser, exam: savedExam },
    ];
    await oldOffer.save(async (er, savedOffre) => {
      if (er != null) {
        res.send(er);
      }
      res.send(savedOffre);
    });
  });
});
module.exports = router;
