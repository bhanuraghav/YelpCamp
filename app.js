var express = require("express"),
	bodyParser=require("body-parser"),
	mongoose= require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	app = express(),
	Campground = require("./models/campgrounds"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB      = require("./seeds"),
	port = process.env.PORT || 3000;

//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	authRoutes = require("./routes/index");

//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });  
mongoose.connect("mongodb://bhanu:raghav1234@ds113482.mlab.com:13482/yelpcamp");
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); 
//seedDB(); //seed the database

// Campground.create(
// 	{
// 		name: "Granite Hill", 
// 		image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
// 		desc: "This is granite hill"
//     },function(err, campground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log("Newly Creted: " + campground);

// 		}
// 	}

// )


//Passport Config

app.use(require("express-session")({
	secret:"Hello secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
})

app.use("/",authRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);







app.listen(port,function(){
	console.log("Server Running");
})