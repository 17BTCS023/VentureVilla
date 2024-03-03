const Listing = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.addReview =  async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id);
    console.log(listing);
    let newReview = new Review({...req.body.review});
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId} });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};