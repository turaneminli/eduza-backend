const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    courseThumbnail: {
      type: String,
      required: true,
    },
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cat: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timeptamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
