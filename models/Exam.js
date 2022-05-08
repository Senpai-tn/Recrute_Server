const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examSchema = new Schema({
  type: { type: String, required: true },
  createdAd: { type: Date, default: Date.now },
  questions: { type: Array, required: true },
  answers: { type: Array, default: [] },
  result: { type: Number, default: 0 },
  idUser: String,
  idOffer: String,
});

const Exam = mongoose.model("exams", examSchema);
module.exports = Exam;
