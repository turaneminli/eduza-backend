const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const serverError500 = require("../utils/serverError");
const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");
require("dotenv").config({ path: "../.env" });
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_user: process.env.API_USER_SEND_GRID,
      api_key: process.env.API_KEY_SEND_GRID,
    },
  })
);

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new customError("Validation failed!", 422, errors.array());
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const surname = req.body.surname;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
        surname: surname,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => serverError500(err, next));
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        throw new customError(
          "A user with this email could not be found.",
          401
        );
      }
      loadedUser = user;
      bcrypt
        .compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            throw new customError("Wrong password. ", 401);
          }
          const token = jwt.sign(
            {
              email: loadedUser.email,
              userId: loadedUser._id.toString(),
            },
            `${process.env.JWT_TOKEN_SECRET}`,
            { expiresIn: "1h" }
          );
          res
            .status(200)
            .json({ token: token, userId: loadedUser._id.toString() });
        })
        .catch((err) => serverError500(err, next));
    })
    .catch((err) => serverError500(err, next));
};

exports.resetPassword = (req, res, next) => {};

exports.forgotPassword = (req, res, next) => {};
