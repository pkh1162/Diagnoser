let mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const postSchema = new Schema({
    title : { type: String, required: true},
    text : String,
    link: String,
    isDeleted : { type: Boolean, default: false},
    created_at: {type: Date, default: Date.now},
    _creator : { type: Schema.ObjectId, ref: "User"},
    _comments: [{type: Schema.ObjectId, ref: "Comment"}]
})








const Post = mongoose.model("Post", postSchema);

module.exports = Post;