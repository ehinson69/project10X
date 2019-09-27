const express = require("express");
const router = express.Router();
const { Course, User } = require("../models");
const { check, validationResult } = require("express-validator");
const authentication = require("./auth");

// Updating the Sequelize model queries for the Courses endpoint GET routes to filter out
//the following properties.
const filter = {
  include: [
    {
      model: User,
      attributes: { exclude: ["password", "createdAt", "updatedAt"] }
    }
  ],
  attributes: { exclude: ["createdAt", "updatedAt"] }
};

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// Send a GET request to courses to view all courses
router.get(
  "/courses/",
  asyncHandler(async (req, res) => {
    Course.findAll(filter)
      .then(courses => {
        if (courses) {
          res.status(200).json(courses);
        } else {
          res.status(404).json({ message: "Courses not found." });
        }
      })
      .catch(function(err) {
        res.send(500);
      });
  })
);

//GET individual course by id of the user that owns it.
router.get(
  "/courses/:id",
  asyncHandler(async (req, res, next) => {
    Course.findByPk(req.params.id, filter)
      .then(course => {
        if (course) {
          res.status(200).json(course);
        } else {
          res.status(404).json({ message: "Course not found." });
        }
      })
      .catch(function(err) {
        res.send(500);
      });
  })
);

//Send a POST request to /courses/ to CREATE a new course + validations
router.post(
  "/courses",
  [
    check("title")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please include a "title"'),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please include a "description"'),
    check("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please include a "userId"')
  ],
  authentication,
  async (req, res, next) => {
    const errors = validationResult(req);

    // If there are any errors
    if (!errors.isEmpty()) {
      // Use the map method to get a list of error messages
      const errorMessages = errors.array().map(error => error.msg);

      // Return validation errors
      const err = new Error(errorMessages);
      err.status = 400;
      next(err);
    } else {
      const course = new Course({
        userId: req.body.userId,
        title: req.body.title,
        description: req.body.description
      });
      try {
        await course.save();
        res.location(`/courses/${course.id}`);
        res.status(201).end();
      } catch (err) {
        if (err.name === "SequelizeValidationError") {
          res.status(400).json({
            message: "Please complete out all of the required fields."
          });
        } else {
          res.json({ message: err.message });
        }
      }
    }
  }
);

// Send a PUT request to /courses/:id to UPDATE (edit) a course and returns no content
router.put(
  "/courses/:id",
  [
    check("title")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please include a "title"'),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please include a "description"'),
    check("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please include a "userId"')
  ],
  authentication,
  async (req, res, next) => {
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);

      // Return the validation errors to the client.
      const err = new Error(errorMessages);
      err.status = 400;
      next(err);
    } else {
      Course.findByPk(req.params.id)
        .then(course => {
          if (course) {
            const user = req.currentUser;
            if (user.id === course.userId) {
              course.update(req.body).then(() => res.status(204).json(course));
            } else {
              res
                .status(403)
                .json({ message: "You are not authorized to edit this page." });
            }
          } else {
            res.status(404).json({ message: "Sorry, that ID doesn't exist." });
          }
        })
        .catch(err => {
          if (err.name === "SequelizeValidationError") {
            res
              .status(400)
              .json({ message: "Please include all required fields." });
          } else {
            res.json({ message: err.message });
          }
          next(err);
        });
    }
  }
);
// Send a DELETE request to /courses/:id DELETE a course and returns no content
router.delete("/courses/:id", authentication, (req, res, next) => {
  const user = req.currentUser;
  Course.findByPk(req.params.id)
    .then(course => {
      if (course) {
        if (user.id === course.userId) {
          course.destroy().then(() => res.status(204).end());
        } else {
          res
            .status(403)
            .json({ message: "You are not authorized to edit this page." });
        }
      } else {
        res.send(404).json({ message: "Please include all required fields." });
      }
    })
    .catch(function(err) {
      const error = new Error("Server error");
      error.status = 500;
      next(error);
    });
});

module.exports = router;
