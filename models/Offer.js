const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  candidates: { type: Array, default: [] },
});

const Offer = mongoose.model("offers", OfferSchema);

module.exports = Offer;
