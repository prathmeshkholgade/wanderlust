const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.AccessToken;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("./listings/index.ejs", {
    allListing,
  });
};
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};
module.exports.showListings = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing You Requseted Dose not Exist");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
 let saved= await newListing.save();
console.log(saved);
  req.flash("success", "New  listing created");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/w_250");
  if (!listing) {
    req.flash("error", "Listing You Requseted Dose not Exist");
    res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing, originalUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated ");
  res.redirect(`/listings/${id}`);
};
module.exports.destoryListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted ");
  res.redirect("/listings");
};
