const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

const Offer = mongoose.model("offers", OfferSchema);

module.exports = Offer;
