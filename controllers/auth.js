const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const serverError500 = require("../utils/serverError");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
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
    .catch((err) => serverError500(err));
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      bcrypt
        .compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            const error = new Error("Wrong password");
            error.statusCode = 401;
            throw error;
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
        .catch((err) => console.log(err));
    })
    .catch((err) => serverError500(err));
};
