const userModels = require("../models/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { first_name: "", last_name: "", email: "", password: "" };

  // incorrect firstname
  if (err.message === "incorrect first_name") {
    errors.first_name = "That name is not correct";
  }
  // incorrect lastname
  if (err.message === "incorrect last_name") {
    errors.last_name = "That name is not correct";
  }
  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("users validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 60 * 60;
const createToken = (id, first_name) => {
  return jwt.sign({ id, first_name }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

//CREATE A USER
module.exports.signup_post = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const user = await userModels.create({
      first_name,
      last_name,
      email,
      password,
    });
    const token = createToken(user._id, user.first_name);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
//CREATE A USER
module.exports.login_get = async (req, res) => {
  res.render("login");
};
//CREATE A USER
module.exports.signup_get = async (req, res) => {
  res.render("signup");
};

//login user
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModels.login(email, password);
    const token = createToken(user._id, user.first_name);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

//logout
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
