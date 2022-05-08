const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  state: {
    type: String,
    enum: ["DRAFT", "SENT", "ACCEPTED", "REFUSED"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  candidates: { type: Array, default: [] },
  liked: { type: Array, default: [] },
  RH: { type: Object, default: {} },
  min: { type: Number, default: 0 },
});

const Offer = mongoose.model("offers", OfferSchema);

module.exports = Offer;
