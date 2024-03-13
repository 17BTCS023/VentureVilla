const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
.get(wrapAsync(ListingController.index))  // Index route
.post(isLoggedin , upload.single("listing[image][url]"),validateListing, wrapAsync(ListingController.createListing)); // Create Route


// New route
router.get("/new", isLoggedin, ListingController.renderNewListingForm);

router.route("/:id")
.get(wrapAsync( ListingController.showListing)) // Show route
.put(isLoggedin, isOwner, upload.single("listing[image][url]"), validateListing, wrapAsync(ListingController.updateListing)) // Update route
.delete(isLoggedin, isOwner, wrapAsync(ListingController.destroy)); // Destroy route

router.get("/category/:category", wrapAsync(ListingController.showFilteredListing));

// Edit route
router.get("/:id/edit", isLoggedin, isOwner,  wrapAsync(ListingController.renderEditForm));

module.exports = router; 