const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course");

// Course Feed (All the posts are listed)
router.get("/courses", courseController.courseFeed);

// Get Single Course
router.get("/course/:courseId", courseController.getCourse);

// Create New Course
router.post("/course", courseController.postNewCourse);

module.exports = router;
