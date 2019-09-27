const express = require("express");
const router = express.Router();
const { User } = require("../models");
const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      err.status = 400;
      next(err);
    }
  };
}

//Authentication middleware
const authenticateUser = async (req, res, next) => {
  let message = null;
  const credentials = auth(req);
  console.log(credentials);
  if (credentials) {
    const user = await User.findOne({
      where: { emailAddress: credentials.name }
    });
    if (user) {
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );
      if (authenticated) {
        req.currentUser = await User.findOne({
          where: { emailAddress: credentials.name },
          attributes: { exclude: ["password", "createdAt", "updatedAt"] }
        });
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = "User not found for provided username";
    }
  } else {
    message = "Auth header not found";
  }

  if (message) {
    res.status(401).json({ message: "Access Denied: " + message });
  } else {
    next();
  }
};

// Returns the currently authenticated user
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    res.json(req.currentUser);
  })
);

// Creates a user, sets the Location header to "/", and returns no content
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const errors = [];
    const userContent = req.body;
    if (!userContent.firstName) {
      errors.push('Please provide a value for "firstName"');
    }
    if (!userContent.lastName) {
      errors.push('Please provide a value for "lastName"');
    }
    if (!userContent.emailAddress) {
      errors.push('Please provide a value for "emailAddress"');
    }
    if (!userContent.password) {
      errors.push('Please provide a value for "password"');
    }

    if (errors.length == 0) {
      const duplicateEmail = await User.findOne({
        where: { emailAddress: req.body.emailAddress }
      });

      if (duplicateEmail) {
        throw new Error(
          req.body.emailAddress +
            " is already associated with an existing account"
        );
      } else {
        await User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          emailAddress: req.body.emailAddress,
          password: bcryptjs.hashSync(req.body.password)
        });
        res
          .status(201)
          .location("/")
          .end();
      }
    } else {
      res.status(400).json({ errors });
    }
  })
);
module.exports = router;
