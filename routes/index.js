var express= require("express"),
	router = express.Router(),
	passport= require("passport"),
	User= require("../models/user");


router.get("/",function (req,res) {
	res.render("landing");
})


//Auth Routes

router.get("/register",function(req,res){
	res.render("register");
})

//handle sign up logic
router.post("/register",function(req,res){
	var newUser= new User({username: req.body.username});

	User.register(newUser,req.body.password,function(err,user){
		if(err){
      	   req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
           	req.flash("success","Welcome to YelpCamp "+ user.username);
			res.redirect("/campgrounds");
		})
	})
})


//Show Login Form
router.get("/login",function(req,res){
	res.render("login");
})

router.post("/login",passport.authenticate("local",
	 {	successRedirect: "/campgrounds",
	 	failureRedirect: "/login"
	}) ,function(req,res){

});


// Logout route

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
})

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect("/login");
}

module.exports=router;

