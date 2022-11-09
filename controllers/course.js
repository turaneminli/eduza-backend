const course = require("../models/course");
const Course = require("../models/course");
const User = require("../models/user");
const serverError500 = require("../utils/serverError");
const checkAuthorization = require("../utils/checkAuthorization");
const customError = require("../utils/customError");

exports.postNewCourse = (req, res, next) => {
  if (!req.file) {
    throw new customError("Image is not uploaded.  ", 422);
  }
  let creator;
  const newCourse = new Course({
    title: req.body.title,
    courseThumbnail: req.file.path,
    creator: req.userId,
  });
  newCourse
    .save()
    .then((course) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.haveCourses.push(newCourse);
      return user.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Successfully posted",
        course: newCourse,
        creator: {
          _id: creator._id,
          name: creator.name,
          surname: creator.surname,
        },
      });
    })
    .catch((err) => {
      serverError500(err);
    });
};

// returns the list of courses with review (populated)
exports.courseFeed = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 6; // number of courses in one page
  let totalItems;
  Course.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Course.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    // .populate("review")
    .then((result) => {
      console.log(result);
      res.status(200).json({
        allCourses: result,
        totalItems: totalItems,
        message: "Fetched successfully",
      });
    })
    .catch((err) => {
      serverError500(err);
    });
};

exports.getCourse = (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId)
    .then((course) => {
      if (!course) {
        throw new customError("Could not find the course.   ", 404);
      }
      console.log("The course is " + course);
      res.status(200).json({
        course: course,
        message: "Course successfully fetched",
      });
    })
    .catch((err) => {
      serverError500(err);
    });
};

// Update Course
const clearImage = require("../utils/clearImage");

exports.editCourse = (req, res, next) => {
  const courseId = req.params.courseId;
  const newTitle = req.body.title;
  let courseThumbnail = req.body.image; // url

  // checking if there is not any image in the edit we do not change the image
  // could be buggy yet!!!
  if (req.file) {
    courseThumbnail = req.file.path;
  }
  if (!courseThumbnail) {
    throw new customError("Tou should specify the image. ", 422);
  }

  Course.findById(courseId)
    .then((course) => {
      if (!course) {
        throw new customError("There is not such course", 404);
      }
      checkAuthorization(course, req);
      if (courseThumbnail !== course.courseThumbnail) {
        clearImage(course.courseThumbnail);
      }
      course.title = newTitle;
      course.courseThumbnail = courseThumbnail;
      // console.log(course);
      return course.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Course updated!", course: result });
    })
    .catch((err) => {
      serverError500(err);
    });
};

exports.deleteCourse = (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId)
    .then((course) => {
      if (!course) {
        throw new customError("There is not such course", 404);
      }
      checkAuthorization(course, req);
      clearImage(course.courseThumbnail);
      return Course.findByIdAndRemove(courseId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.haveCourses.pull(courseId);
      // console.log(result);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};
