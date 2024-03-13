const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../utils/schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const user = require("../models/user.js");
const multer = require("multer");
const listingController = require("../controllers/listing");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/")
  .get(wrapAsync(listingController.index)) // index.js
  .post(
    isLoggedIn,
    // validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  ); //Create Route
  
// .post(,(req,res)=>{
//   res.send(req.file)
// })

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings)) // show Route

  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,

    wrapAsync(listingController.updateListing) // update
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destoryListing) //delete
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
