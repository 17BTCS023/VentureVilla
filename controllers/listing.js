const Listing = require("../models/listings.js")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", {allListings}); 
};

module.exports.renderNewListingForm = (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({ path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listings"); 
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}

module.exports.createListing = async (req, res, next) => {
    console.log({...req.body.listing});
    let object = req.body.listing;
    let newListing = new Listing({
        title: object.title,
        description: object.description,
        image: {
            filename: req.file.filename,
            url: req.file.path,
        },
        price: object.price,
        location: object.location,
        country: object.country,
        owner: req.user._id,
    });
    await newListing.save();
    req.flash("success", "New Listing was created!");
    res.redirect("/listings"); 
};

module.exports.renderEditForm = async (req, res) => { 
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing =  async (req, res) => {
    let {id} = req.params;
    console.log({...req.body.listing});
    if(!req.body.listing){
        req.flash("error", "Listing does not exist");
    }else{
        if( typeof req.file !== "undefined"){
            await Listing.findByIdAndUpdate(id, {...req.body.listing, 
                image: {
                    filename: req.file.filename,
                    url: req.file.path,
                }});
        }else{
            await Listing.findByIdAndUpdate(id, {...req.body.listing, });
        }
        req.flash("success", "Listing was updated successfully!");
    }
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    if(!listing){
        req.flash("error", "Listing does not exist");
    }else{
        req.flash("success", "Listing was deleted successfully!");
    }
    res.redirect("/listings");
};
