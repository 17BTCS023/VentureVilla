const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/venturevilla";

main()
.then(() => console.log("Connection Successful"))
.catch((err) => console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : "65e20c25af82f298ba105d66"}));
    await Listing.insertMany(initData.data);
    console.log("DB was initialized");
}

initDB();