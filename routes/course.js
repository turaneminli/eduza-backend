const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");

// Course feed
router.get("/courses", courseController.courseFeed);

router.post("/courses", courseController.postNewCourse);

module.exports = router;
