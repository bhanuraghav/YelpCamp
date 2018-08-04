var express= require("express"),
	router = express.Router();
var Campground= require("../models/campgrounds");
var middleware = require("../middleware");



//Index
router.get("/",function(req,res){
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds});

		}
	})

})

//New - show form to create new campgrounds
router.get("/new",middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new");

})


router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name,
		image = req.body.image,
		price=req.body.price,
		description = req.body.description;
	
	var author={
		id: req.user._id,
		username: req.user.username
	}

	var newCamp={
		name: name,
		image: image,
		price: price,
		description: description,
		author: author
	};
	Campground.create(newCamp ,middleware.isLoggedIn, function(err,newlyCamp){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");

		}
	})

})


//Show
router.get("/:id",function(req,res){
	//find campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err ,foundCamp){
		if(err){
			console.log(err);
		}
		else{
			//console.log(foundCamp);
			res.render("campgrounds/show",{campground:foundCamp});

		}
	})

})

//Edit Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership ,function(req,res){
	//if user logged in?
		// if(req.isAuthenticated()){
		// 	Campground.findById(req.params.id,function(err,foundCamp){
		// 		if(err){
		// 			res.redirect("/campgrounds");
		// 		}
		// 		else{
		// 			//does user own the campground
		// 			//foundCamp.authod.id = string
		// 			//req.user._id = object 
		// 			console.log(foundCamp.author.id);
		// 			console.log(req.user._id);
		// 			// if(foundCamp.author.id.equals(req.user._id)){	
		// 			if(foundCamp.author.id==req.user._id){	
		// 				res.render("campgrounds/edit",{ campground : foundCamp});
		// 			}
		// 			else{
		// 				res.send("Dont have permission");
		// 			}
		// 		}
		// 	});
		// }
		// else{
		// 	res.redirect("/campgrounds");
		// }
	//otherwise,redirect
	//if not redirect
	Campground.findById(req.params.id,function(err,foundCamp){
			res.render("campgrounds/edit",{ campground : foundCamp});
	});		


	
})

//UPDATE Campground Route
router.put("/:id",middleware.checkCampgroundOwnership ,function(req,res){
	//find and update the correct campground

	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
	//redirect ShowPage
			res.redirect("/campgrounds/" + req.params.id);
		}
	})

})

//Destroy Campground Route
router.delete("/:id",middleware.checkCampgroundOwnership ,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err,deleteCamp){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");

		}
	})
})


module.exports=router;
