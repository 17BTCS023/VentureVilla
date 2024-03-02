const mongoose = require("mongoose");
const Review = require('./review.js');
const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required: true 
    },
    description : {
        type : String,
        required: true
    },
    image : {
        filename: String,
        url : {
            type : String,
            // default : "https://cdn.pixabay.com/photo/2015/06/12/12/10/castle-park-806854_1280.jpg",
            set : (v) => v === "" ? "https://cdn.pixabay.com/photo/2015/06/12/12/10/castle-park-806854_1280.jpg" : v,
        }
    },
    price : {
        type: Number,
        required: true,
    },
    location : {
        type : String,
    },
    country : {
        type : String,
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

});

// Post middleware 
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id : { $in : listing.reviews }}); 
    }
});

const Listing = mongoose.model("Listing", listingSchema); 

module.exports = Listing;
