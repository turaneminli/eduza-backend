const express = require("express");
const router = express.Router();

const courseController = require("../controllers/course");

// GET - Course Feed (All the posts are listed)
router.get("/courses", courseController.courseFeed);

// GET -  Single Course
router.get("/course/:courseId", courseController.getCourse);

// POST - Create New Course
router.post("/course", courseController.postNewCourse);

// PUT - Edit course
router.put("/course/:courseId", courseController.editCourse);

// DELETE - Delete course
router.delete("/course/:courseId", courseController.deleteCourse);

module.exports = router;
