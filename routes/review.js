const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/review.js");
//Reviews 
    
// Post review Route 
router.post("/", isLoggedin,  validateReview, wrapAsync(ReviewController.addReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedin, isReviewAuthor,  wrapAsync(ReviewController.destroyReview));

module.exports = router;