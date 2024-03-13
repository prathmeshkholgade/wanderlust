const Listing = require("./models/listing.js");
const { listingSchema } = require("./utils/schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./utils/schema.js");
const review = require("./models/review.js");

module.exports.isLoggedIn = (req, res,next) => {
    console.log(req.user);
  if (!req.isAuthenticated()) {
    console.log( req.orignalUrl)
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listings");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirect =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req,res,next)=>{
  let {id}=req.params;
  let listing = await Listing.findById(id);
  if( !listing.owner._id.equals(res.locals.currUser._id) ){
    req.flash("error","you are not the owner of the lisitng");
    return res.redirect(`/listings/${id}`)
  }
  next()
}
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  console.log(req.body.review);
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req,res,next)=>{
  let {id,reviewId}=req.params;
  let Review = await review.findById(reviewId);
  if( !Review.author._id.equals(res.locals.currUser._id) ){
    req.flash("error","you are not the author of the review");
    return res.redirect(`/listings/${id}`)
  }
  next()
}