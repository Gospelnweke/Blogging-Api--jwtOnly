const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bloggSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please enter a title"],
    unique: true,
  },
  author: {
    type: String,
    required: [true, "Please enter a title"],
  },
  description: {
    type: String,
  },
  body: {
    type: String,
    required: [true, "Please write a blog here"],
    minlength: [6, "Blog length is too short"],
  },
  state: {
    type: String,
    enum: {
      values: ["draft", "published"],
      default: "draft",
      message: "Please enter one of: draft or published!",
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  authorId: {
    type: String,
    default: "",
  },
  tags: {
    type: Array,
    default: ["tags"],
  },
  read_count: {
    type: Number,
    default: 0,
  },
  read_time: {
    type: Number,
  },
});

// fire a function before doc saved to db
bloggSchema.pre("save", async function (next) {
  this.read_time = 60;
  next();
});

const Blog = mongoose.model("blogg", bloggSchema);

module.exports = Blog;
