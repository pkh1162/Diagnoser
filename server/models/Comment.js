let mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const commentSchema = new Schema({
    text: { type: String, required: true },
    isDeleted : { type: Boolean, default: false},
    created_at: {type: Date, default: Date.now},
    _creator : { type: Schema.ObjectId, ref: "User"},
    _post : { type: Schema.ObjectId, ref: "Post"}
})


//With Mongoose you get lifecycle hooks which can be used to specify actions to be taken whenever an operation is
//performed on the schema that you specify. For example, if I wanted to populate the _creator field and project only
//the username, created_at and minus the id field, everytime I run 
//the find command, I set up the mongoose middleware like this:

/*
const autoPopulateCreator = (next) => {
    this.populate({
        path: "_creator",
        select: "username created_at -_id"
    })
    next();
}
*/

//and then relate the above method to the schema, the pre function indicates that this action should be performed pre find, I think.
//commentSchema.post("find", autoPopulateCreator);


const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;