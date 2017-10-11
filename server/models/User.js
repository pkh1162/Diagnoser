let mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const userSchema = new Schema({
    privilege: {
        type: String,
        required: true
    },
    status: {
            type: String
    },
    localUser : {
        username : {
            type: String,
            required: false,
            minLength: [4, "Username must be four characters or more"]
        },
        password : {
            type: String,
            required: false,
            minLength: [8, "Password must be eight characters or more"]
        },
        email : {
            type: String,
            required: false
        }
    },
    strategyUser : {
        identifier: String,
        username: String,
        email: String
    },
    created_at: {type: Date, default: Date.now},
    isDeleted: { type: Boolean, default: false }
})


//Some password encryption would go here 

userSchema.query.byUsernameOrEmail = function(name, email) {
  return this.findOne({$or : [{ "localUser.username" : name }, {"localUser.email" : email }]});
};

userSchema.query.byEmail = function(email) {
  return this.findOne({"localUser.email" : email});
};





const User = mongoose.model("User", userSchema);

module.exports = User;
