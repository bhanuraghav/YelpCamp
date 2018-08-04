//all the middleware goes here
var Campground= require("../models/campgrounds");
var Comment= require("../models/comment");

var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function (req,res,next){
	if(req.isAuthenticated()){
			Campground.findById(req.params.id,function(err,foundCamp){
				if(err){
           	   		req.flash("error","Campground not found");
					res.redirect("back");
				}
				else{
			
					if(foundCamp.author.id.equals(req.user._id)){	
						next();
					}
					else{
		    			req.flash("error","You don't have the permission to do that");
						res.redirect("back");
					}
				}
			});
		}
	else{
    	req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership =function(req,res,next){
	if(req.isAuthenticated()){
        Comment.findById(req.params.comments_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
		    	req.flash("error","You don't have the permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
    	req.flash("error","You Need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn= function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	} 
	req.flash("error","You Need to be logged in to do that");
	res.redirect("/login");
}


module.exports = middlewareObj;
