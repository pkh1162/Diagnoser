let dbModels = require("../models/index.js");

const postController = {};

postController.post = (req, res) => {
    const {
        title,
        text,
        link,
        userId, //userId coming from users jwt token.
    } = req.body;

    const post = new dbModels.Post({
        title,
        text,
        link,
        _creator: userId
    });
    
    post.save()
        .then((newPost)=>{
            return res.status(200).json({
                success: true,
                postData: newPost
            })
        })
        .catch((err)=> {
            return res.status(500).json({
                message: err
            })
        })
}


postController.getAll = (req, res) => {
    dbModels.Post.find({}).populate(
        {
            path: "_creator",                        //popultates path proprety with the mongoose entry corresponding to the id passed in.
            select: "username created_at -_id"       //this is pretty much just the projection, (-) for exclusion, everything else is inclusion, fileds sperarated by spaces.
        })
        .populate({
            path: "_comments",
            select: "_creator text created_at",
            match: {"isDeleted" : false},
            populate : {
                path: "_creator",
                select: "-_id username created_at"
            }
        })
        .then(posts => {
            return res.status(200).json({
                success: true,
                allPostsData: posts
            })
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        })
}


module.exports = postController;