const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");



router.route("/")
.get(wrapAsync(ListingController.index))  // Index route
.post(isLoggedin , validateListing,  wrapAsync(ListingController.createListing)); // Create Route

router.route("/:id")
.get(wrapAsync( ListingController.showListing)) // Show route
.put(isLoggedin, isOwner, validateListing, wrapAsync(ListingController.updateListing)) // Update route
.delete(isLoggedin, isOwner, wrapAsync(ListingController.destroy)); // Destroy route

// New route
router.get("/new", isLoggedin, ListingController.renderNewListingForm);

// Edit route
router.get("/:id/edit", isLoggedin, isOwner,  wrapAsync(ListingController.renderEditForm));

module.exports = router; 