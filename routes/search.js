const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ListingController = require("../controllers/listing.js");

router.get("/:location", wrapAsync(ListingController.searchedListing));

module.exports = router; 