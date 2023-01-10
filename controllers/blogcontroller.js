const blogModel = require("../models/blogs");
const jwt = require("jsonwebtoken");
// const decodedtoken = require("../middlewares/blogMiddleware");

const handleErrors = (err) => {
  let errors = { title: "", body: "", state: "" };

  // duplicate title error
  if (err.code === 11000) {
    errors.title = "this title is already used";
    return errors;
  }

  // validation errors
  if (err.message.includes("blogg validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
  // console.log(err);
};

//CREATE BLOG
module.exports.creatblog_post = async (req, res) => {
  const token = req.cookies.jwt;
  const {
    title,
    author,
    description,
    body,
    state,
    timestamp,
    tags,
    read_count,
    read_time,
    authorId,
  } = req.body;
  try {
    const blog = await blogModel.create({
      title,
      author,
      description,
      body,
      state,
      timestamp,
      tags,
      read_count,
      read_time,
      authorId,
    });

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          // res.redirect("/signup");
        } else {
          blog.authorId = decodedToken.id;
          blog.save();
        }
      });
    } else {
      console.log("no token found");
    }

    console.log(blog);
    res.status(201).json({ blog });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

//SHOW ALL BLOGS
module.exports.getblogs_get = async (req, res) => {
  const blogs = await blogModel.find();
  res.send(blogs);
};
// //SHOW ONE BLOGS
// module.exports.getOneblog_get = async (req, res) => {
//   const id = req.body.id;
//   const blog = await blogModel.findById(id);
//   res.send(blog);
// };

//SHOW ONLY USER BLOGS
module.exports.getmyblogs_get = async (req, res) => {
  const token = req.cookies.jwt;
  console.log(`myblogs: ${req.cookies.jwt}`);
  // const decodedtok = "";

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        // res.redirect("/signup");
      } else {
        const decodedtok = decodedToken.id;
        console.log(decodedToken);
        blogModel
          .find({ authorId: decodedtok })
          .then(function (blogs) {
            res.send(blogs);
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    });
  } else {
    console.log("no token found");
  }

  // try {
  //   const decodedtoken = "6364989eb398a5c1bb1d1ce1";
  //   const blogs = await blogModel.find({
  //     authorId: decodedtok,
  //   });
  //   res.send(blogs);
  // } catch (err) {
  //   console.log(err);
  //   const errors = handleErrors(err);
  //   res.status(400).json({ errors });
  // }
};

//UPDATE BLOG STATE WITH
module.exports.updateblogstate_post = async (req, res) => {};
