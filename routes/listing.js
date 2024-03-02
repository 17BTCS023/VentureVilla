const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");


// Index route
router.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", {allListings}); 
}));

// New route
router.get("/new", isLoggedin, (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
});

// Show route
router.get("/:id", wrapAsync( async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listings"); 
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}));

// Create Route
router.post("/", isLoggedin , validateListing,  wrapAsync((async (req, res, next) => {
        console.log({...req.body.listing});
        let object = req.body.listing;
        let newListing = new Listing({
            title: object.title,
            description: object.description,
            image: {
                filename: "listingimage",
                url: object.image.url
            },
            price: object.price,
            location: object.location,
            country: object.country,
            owner: req.user._id,
        });
        await newListing.save();
        req.flash("success", "New Listing was created!");
        res.redirect("/listings"); 
    }
)));

// Edit route
router.get("/:id/edit", isLoggedin, isOwner,  wrapAsync(async (req, res) => { 
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id", isLoggedin, isOwner, validateListing, wrapAsync( async (req, res) => {
    let {id} = req.params;
    console.log({...req.body.listing});
    let object = req.body.listing;
    let updatedListing = new Listing({
        _id : id,
        title: object.title,
        description: object.description,
        image: {
            filename: "listingimage",
            url: object.image.url
        },
        price: object.price,
        location: object.location,
        country: object.country,
        reviews: object.reviews,
        owner: object.owner,
    });
    if(!object){
        req.flash("error", "Listing does not exist");
    }else{
        await Listing.findByIdAndUpdate(id, {...updatedListing});
        req.flash("success", "Listing was updated successfully!");
    }
    res.redirect(`/listings/${id}`);
}));

// Destroy route
router.delete("/:id", isLoggedin, isOwner, wrapAsync( async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    if(!listing){
        req.flash("error", "Listing does not exist");
    }else{
        req.flash("success", "Listing was deleted successfully!");
    }
    res.redirect("/listings");
}));

module.exports = router; 