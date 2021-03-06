const Streamer = require("../models/streamer"),
    Comment = require("../models/comment");  
    
//All the middleware goes here      
const middlewareObject = {};

//Function that checks if request is authenticated
middlewareObject.isLoggedIn = (request, response, next) => {
    if (request.isAuthenticated()) {
        return next();
    };
    request.flash("error", "You need to be logged in to do that!");
    response.redirect("/login");
};

//Function that checks if user owns the Streamer Page
middlewareObject.checkStreamerOwnership = (request, response, next) => {
    //Check if User is logged in
    if (request.isAuthenticated()) {
        Streamer.findOne({slug: request.params.slug}, (error, foundStreamer) => {
            if (error || !foundStreamer) {
                //If not logged in - redirect
                request.flash("error", "Influencer not found!");
                response.redirect("/streamers");
            } else {
                //Does User own the Streamer page
                //Checking with mongoose method .equals
                if (foundStreamer.author.id.equals(request.user._id)) {
                    next();
                } else {
                    //Otherwise, redirect
                    request.flash("error", "You don't have permission to do that!");
                    response.redirect("back");
                };
            };
        });
    } else {
        request.flash("error", "You don't have permission to do that!");
        response.redirect("back");
    };
};

//Function that checks if user owns the Comment
middlewareObject.checkCommentOwnership = (request, response, next) => {
    //Check if User is logged in
    if (request.isAuthenticated()) {
        Comment.findById(request.params.comment_id, (error, foundComment) => {
            if (error || !foundComment) {
                //If comment id not found - redirect
                request.flash("error", "Comment not found!");
                response.redirect("/streamers/" + request.params.id);
            } else {
                //Does User own the Comment 
                //Checking with mongoose method .equals
                if (foundComment.author.id.equals(request.user._id)) {
                    next();
                } else {
                    //Otherwise, redirect
                    request.flash("error", "You don't have permission to do that!");
                    response.redirect("back");
                };
            };
        });
    } else {
        request.flash("error", "You need to be logged in to do that!");
        response.redirect("back");
    };
};

module.exports = middlewareObject;