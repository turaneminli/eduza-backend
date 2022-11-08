const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      required: true,
    },
    haveCourses: [
      { type: Schema.Types.ObjectId, ref: "Course", required: true },
    ],
  },
  { timeptamps: true }
);

userSchema.virtual("fullName").get(function () {
  return this.name + " " + this.surname;
});

module.exports = mongoose.model("User", userSchema);
