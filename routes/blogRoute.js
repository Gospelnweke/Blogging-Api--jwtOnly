const Router = require("express");
const blogcontroller = require("../controllers/blogcontroller");
const { requireAuth, checkUser } = require("../middlewares/authMiddleware");

const blogRouter = Router();

blogRouter.post("/createblog", blogcontroller.creatblog_post);
blogRouter.get("/getblogs", blogcontroller.getblogs_get);
blogRouter.get("/getmyblogs", requireAuth, blogcontroller.getmyblogs_get);
// router.put("/update", blogcontroller.updateblog_put);
// router.delete("/deleteblog", blogcontroller.deleteblog_delete);

module.exports = blogRouter;
