var mongoose = require("mongoose");
var util = require("../util");

// schema
var postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "제목은 필수입니다."]
  },
  body: {
    type: String,
    required: [true, "내용은 필수입니다."]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    username : {
        type : String
  }},
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
}, {
  toObject: {
    virtuals: true
  }
});

// virtuals
postSchema.virtual("createdDate")
  .get(function () {
    return util.getDate(this.createdAt);
  });

postSchema.virtual("createdTime")
  .get(function () {
    return util.getTime(this.createdAt);
  });

postSchema.virtual("updatedDate")
  .get(function () {
    return util.getDate(this.updatedAt);
  });

postSchema.virtual("updatedTime")
  .get(function () {
    return util.getTime(this.updatedAt);
  });

// model & export
var Post = mongoose.model("post", postSchema);
module.exports = Post;