const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");


// Index route
router.get("/", wrapAsync(ListingController.index));

// New route
router.get("/new", isLoggedin, ListingController.renderNewListingForm);

// Show route
router.get("/:id", wrapAsync( ListingController.showListing));

// Create Route
router.post("/", isLoggedin , validateListing,  wrapAsync(ListingController.createListing));

// Edit route
router.get("/:id/edit", isLoggedin, isOwner,  wrapAsync(ListingController.renderEditForm));

// Update route
router.put("/:id", isLoggedin, isOwner, validateListing, wrapAsync(ListingController.updateListing));

// Destroy route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(ListingController.destroy));

module.exports = router; 