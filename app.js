const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/venturevilla";
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
    
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

const sesisonOptions = {
    secret : "mySuperSceretCode",
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}

app.use(session(sesisonOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    next();
})

app.get("/", (req, res) =>{
    res.send("I am root and groot of this app, ha ha ha ");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)

// unkown path 
app.all( "*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    console.log(message + " " + status);
    res.status(status).render("error.ejs", { err });
    // res.status(statusCode).send(message);   
})

app.listen(3000, () =>{
    console.log("Server is listening on port 3000");
});