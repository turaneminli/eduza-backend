const course = require("../models/course");
const Course = require("../models/course");
const User = require("../models/user");
const serverError500 = require("../utils/serverError");
const checkAuthorization = require("../utils/checkAuthorization");
const Review = require("../models/review");
const customError = require("../utils/customError");
const Category = require("../models/category");

exports.postNewCourse = (req, res, next) => {
  if (!req.file) {
    throw new customError("Image is not uploaded.  ", 422);
  }
  let creator;
  const newCourse = new Course({
    title: req.body.title,
    courseThumbnail: req.file.path,
    creator: req.userId,
    cat: req.body.category,
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
      serverError500(err, next);
    });
};

// returns the list of courses
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
    .then((result) => {
      console.log(result);
      res.status(200).json({
        allCourses: result,
        totalItems: totalItems,
        message: "Fetched successfully",
      });
    })
    .catch((err) => {
      serverError500(err, next);
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
      serverError500(err, next);
    });
};

// Update Course
const clearImage = require("../utils/clearImage");

exports.editCourse = (req, res, next) => {
  const courseId = req.params.courseId;
  const newTitle = req.body.title;
  const newCategory = req.body.category;
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
      checkAuthorization(course, req, "course");
      if (courseThumbnail !== course.courseThumbnail) {
        clearImage(course.courseThumbnail);
      }
      course.title = newTitle;
      course.courseThumbnail = courseThumbnail;
      course.cat = newCategory;
      // console.log(course);
      return course.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Course updated!", course: result });
    })
    .catch((err) => {
      serverError500(err, next);
    });
};

exports.deleteCourse = (req, res, next) => {
  const courseId = req.params.courseId;
  Course.findById(courseId)
    .then((course) => {
      if (!course) {
        throw next(new customError("There is not such course", 404));
      }
      checkAuthorization(course, req, "course");
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
      serverError500(err, next);
    });
};

exports.getReviews = (req, res, next) => {
  const courseId = req.params.courseId;
  Review.find({ course: courseId })
    .then((reviews) => {
      res
        .status(200)
        .json({ reviews: reviews, message: "Fetched reviews successfully." });
    })
    .catch((err) => {
      serverError500(err, next);
    });
};

exports.postReview = async (req, res, next) => {
  const comment = req.body.comment;
  const score = req.body.score;
  const courseId = req.params.courseId;
  const author = req.userId;
  const newReview = new Review({
    author: author,
    course: courseId,
    score: score,
    comment: comment,
  });
  try {
    const review = await newReview.save();
    const course = await Course.findById(courseId);
    course.review.push(review);
    await course.save();
    res
      .status(201)
      .json({ newReview: review, message: "Review created successfully." });
  } catch (err) {
    serverError500(err, next);
  }
};

exports.editReview = async (req, res, next) => {
  const newComment = req.body.comment;
  const newScore = req.body.score;
  // const courseId = req.params.courseId;
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new customError("There is not such review", 404);
    }
    review.comment = newComment;
    review.score = newScore;
    const result = await review.save();
    res.status(200).json({
      editedReview: result,
      message: "You edited review successfully. ",
    });
  } catch (err) {
    serverError500(err, next);
  }
};

exports.deleteReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const courseId = req.params.courseId;
  // console.log(reviewId);
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw next(new customError("There is not such review", 404));
    }
    // checkAuthorization(review, req, "review");
    await Review.findByIdAndRemove(reviewId);
    const course = await Course.findById(courseId);
    course.review.pull(reviewId);
    await course.save();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    serverError500(err, next);
  }
};

exports.getCategoryList = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      categories: categories,
    });
  } catch (err) {
    serverError500(err, next);
  }
};

exports.getByCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const courses = await Course.find({ cat: categoryId });
    res.status(200).json({
      courses: courses,
      message: `Fetched ${(await Category.findById(categoryId)).name}`,
    });
  } catch (err) {
    serverError500(err, next);
  }
};

exports.createCategory = async (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const newCategory = new Category({ name: name, description: description });
  try {
    const category = await newCategory.save();
    res.status(201).json({
      newCategory: category,
    });
  } catch (err) {
    serverError500(err, next);
  }
};
