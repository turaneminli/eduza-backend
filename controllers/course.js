const Course = require("../models/course");

// Posting New Course with only title
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
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};

// returns the list of courses with review (populated)
exports.courseFeed = (req, res, next) => {
  Course.find()
    // .populate("review")
    .then((result) => {
      console.log(result);
      res.status(200).json({
        allCourses: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};

exports.getCourse = (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId)
    .then((course) => {
      if (!course) {
        const error = new Error("Could not find the course");
        error.statusCode = 404;
        throw error;
      }
      console.log("The course is " + course);
      res.status(200).json({
        course: course,
        message: "Course successfully fetched",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};
