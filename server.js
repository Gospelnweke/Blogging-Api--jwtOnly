const express = require("express");

require("dotenv").config();
const { connectToMongoDB } = require("./database/db");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const { authRouter } = require("./routes/authRoutes");
const blogRouter = require("./routes/blogRoute");
const { requireAuth, checkUser } = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 3030;

connectToMongoDB();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("*", checkUser);
app.use(authRouter);
app.use("/blogs", blogRouter);

app.get("/createBlog", requireAuth, (req, res) => res.render("createBlog"));
app.get("/myBlogs", requireAuth, (req, res) => {
  axios
    .get("http://localhost:2028/blogs/getmyblogs")
    .then(function (response) {
      //console.log(response);
      res.render("myblogs", { myblogs: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/blogs", requireAuth, (req, res) => {
  axios
    .get("http://localhost:2028/blogs/getblogs")
    .then(function (response) {
      //console.log(response);
      res.render("blogs", { blogs: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
  // res.render("blogs", { users: "new blogs" });
});
// 404 route
app.use("*", (req, res) => {
  return res.status(404).json({ message: "route not found" });
});
app.listen(PORT, (req, res) => {
  console.log(`http://localhost:${PORT}`);
});
