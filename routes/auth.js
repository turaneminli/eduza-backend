const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const router = express.Router();

const authController = require("../controllers/auth");

router.put(
  "/signup",
  [
    body("password").trim().isLength({ min: 6 }),
    body("name").trim().not().isEmpty(),
    body("surname").trim().not().isEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail({ gmail_remove_dots: false }),
  ],
  authController.signup
);

module.exports = router;
