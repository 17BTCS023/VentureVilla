const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");

router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(
    async (req, res, next) => {
    try {
            let {username, email, password} = req.body;
            let newUser = new User({
                username : username,
                email: email,
            });
        
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            req.flash("success", "Welcome to VentureVilla!");
            res.redirect("/listings");
        }
        catch (error) {
            req.flash("error", "user already signed up");
            res.redirect("/signup");
        }
    }
));


module.exports = router;