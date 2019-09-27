const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).

    const user = await User.findOne({
      where: { emailAddress: credentials.name }
    });

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );

      // If authenticated
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );

        // store the retrieved user object on the request
        // so any middleware functions will have access to the user's info
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }

  // If user authentication fails
  if (message) {
    console.warn(message);

    // Return a response with a 401 status code.
    res.status(401).json({ message: "Access Denied" });
  } else {
    // if user authentication succeeded call the next method.
    next();
  }
};

module.exports = authentication;
