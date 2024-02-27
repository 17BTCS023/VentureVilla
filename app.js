const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/venturevilla";

const listings = require("./routes/listing.js");
    
main()
.then(() => console.log("Connected to DB"))
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.get("/", (req, res) =>{
    res.send("I am root and groot of this app, ha ha ha ");
});



const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

app.use("/listings", listings);

//Reviews 

// Post review Route 
app.post("/listings/:id/reviews", validateReview, wrapAsync( async (req, res) => {
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
app.delete("/listings/:id/reviews/:reviewId", wrapAsync( async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId} });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

// app.get("/testlisting", async (req, res) =>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description: "Cake by the Ocean Vibe",
//         image: "",
//         price : 3000,
//         location: "Conture Back",
//         country : "India"
//     });

//     await sampleListing.save().then(() => console.log("all okay")).catch((err) => console.log(err));
//     console.log(sampleListing);
//     res.send("successful testing");
// });

// unkown path 
app.all( "*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    let { status = 400, message = "Something went wrong" } = err;
    console.log(err.message + " " + err.status);
    res.render("error.ejs", { err });
    
    // res.status(statusCode).send(message);   
})


app.listen(3000, () =>{
    console.log("Server is listening on port 3000");
});