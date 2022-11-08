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
      required: false,
    },
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timeptamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
