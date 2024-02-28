const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// Index route
router.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", {allListings}); 
}));

// New route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show route
router.get("/:id", wrapAsync( async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listings"); 
    }
    res.render("listings/show.ejs", {listing});
}));

// Create Route
router.post("/", validateListing,  wrapAsync((async (req, res, next) => {
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
        });
        await newListing.save();
        req.flash("success", "New Listing was created!");
        res.redirect("/listings"); 
    }
)));

// Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => { 
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id", validateListing, wrapAsync( async (req, res) => {
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
        reviews: object.reviews
    });
    if(!object){
        req.flash("error", "Listing does not exist");
    }else{
        await Listing.findByIdAndUpdate(id, {...updatedListing});
        req.flash("success", "Listing was updated successfully!");
    }
    res.redirect("/listings");
}));

// Destroy route
router.delete("/:id", wrapAsync( async (req, res) =>{
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