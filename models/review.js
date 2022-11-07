const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
