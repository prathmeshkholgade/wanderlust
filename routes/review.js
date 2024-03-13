const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../utils/schema.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

const {
  validateReview,
  isLoggedIn,
  isOwner,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews");

//Reviews route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//review delete
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destoryReview)
);

module.exports = router;
