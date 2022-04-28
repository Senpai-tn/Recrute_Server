const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  login: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "SUPER_ADMIN", "HR", "CANDIDATE"],
    required: true,
  },
  offers: { type: Array, default: [] },
  likes: { type: Array, default: [] },
  exams: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
