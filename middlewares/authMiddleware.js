const jwt = require("jsonwebtoken");
const User = require("../models/users");
// require("dotenv").config();

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const userMW = (req, res, next) => {
  if (req.token.user === null) {
    res.redirect("login");
  }
  next();
};

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(req.cookies.jwt);

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/signup");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = { checkUser, requireAuth };
