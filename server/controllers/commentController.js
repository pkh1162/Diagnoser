let dbModels = require("../models/index.js");

const commentController = {};

commentController.post = (req, res) => {
    const {
        text,
        userId,
        postId
    } = req.body;

    const comment = new dbModels.Comment({
        text,
        post: postId,
        _creator: userId
    });
    
    comment.save()
        .then((newComment) => {

            dbModels.Post.findByIdAndUpdate(postId, {$push : {"_comments" : newComment._id}})
                .then(existingPost => {
                    return res.status(200).json({
                        success: true,
                        commentData: newComment,
                        existingPost
                    })
                }).catch(err => {
                    return res.status(500).json({
                        message: err
                    })        
                })            
        })
        .catch((err)=> {
            return res.status(500).json({
                message: err
            })
        })
}


commentController.getAll = (req, res) => {
    dbModels.Post.find({}).populate(
        {
            path: "_creator",                       //popultates path proprety with the mongoose entry corresponding to the id passed in.
            select: "username created_at -_id"       //this is pretty much just the projection, (-) for exclusion, everything else is inclusion, fileds sperarated by spaces.
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


module.exports = commentController;