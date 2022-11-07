const Course = require("../models/course");

exports.postNewCourse = (req, res, next) => {
  const newCourse = new Course({
    title: req.body.title,
  });
  newCourse
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Successfully posted",
        course: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.courseFeed = (req, res, next) => {
  Course.find()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        allCourses: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
