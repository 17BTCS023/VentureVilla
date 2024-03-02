const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const {validateReview} = require("../middleware.js");

//Reviews 

// Post review Route 
router.post("/", validateReview, wrapAsync( async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id);
    console.log(listing);
    let newReview = new Review({...req.body.review});
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
router.delete("/:reviewId", wrapAsync( async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId} });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;