const jwt = require("jsonwebtoken");

const decodedtoken = async (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        // res.redirect("/signup");
      } else {
        token = decodedToken.id;
        return token;
      }
    });
  } else {
    console.log("no token found");
  }
};

module.exports = decodedtoken;
