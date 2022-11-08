const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

const courseController = require("../controllers/course");

// GET - Course Feed (All the posts are listed)

// /courses?page=8 (paginator)
router.get("/courses", courseController.courseFeed);

// GET -  Single Course
router.get("/course/:courseId", isAuth, courseController.getCourse);

// POST - Create New Course
router.post("/course", isAuth, courseController.postNewCourse);

// PUT - Edit course
router.put("/course/:courseId", isAuth, courseController.editCourse);

// DELETE - Delete course
router.delete("/course/:courseId", isAuth, courseController.deleteCourse);

module.exports = router;
