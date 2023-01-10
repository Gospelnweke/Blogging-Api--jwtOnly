const { Router } = require("express");
const authcontroller = require("../controllers/authcontroller");

const authRouter = Router();

authRouter.get("/signup", authcontroller.signup_get);
authRouter.post("/signup", authcontroller.signup_post); //create user
authRouter.get("/login", authcontroller.login_get);
authRouter.post("/login", authcontroller.login_post);
authRouter.get("/logout", authcontroller.logout_get);

module.exports = { authRouter };
