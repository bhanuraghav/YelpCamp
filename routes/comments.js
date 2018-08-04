var express= require("express"),
	router = express.Router({mergeParams: true});

var Campground= require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments New
router.get("/new",middleware.isLoggedIn ,function(req,res){
	Campground.findById(req.params.id, function(err,foundCamp){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground: foundCamp});	

		}
	})
})

//Comments Create
router.post("/",middleware.isLoggedIn ,function(req,res){
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
           		   req.flash("error","Something went wrong");
					console.log(err);
				}
				else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;

					//save comment
					comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save();
           	   		req.flash("success","Successfully added comment");
					res.redirect("/campgrounds/"+ foundCamp._id);
				}
			})
		}
	})
})

//Edit Comments
router.get("/:comments_id/edit",middleware.checkCommentOwnership ,function(req,res){
	Comment.findById(req.params.comments_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {campground_id: req.params.id,
				comment: foundComment});

		}
	})

})
//Update Comment
router.put("/:comments_id",middleware.checkCommentOwnership ,function(req,res){
	Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment,function(err,newComment){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
})

//DeStroy Comment

router.delete("/:comments_id",middleware.checkCommentOwnership ,function(req,res){
	Comment.findByIdAndRemove(req.params.comments_id,function(err){
		if(err){
			res.redirect("back");
		}
		else{
         	req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+ req.params.id);

		}
	})
})



module.exports=router;

