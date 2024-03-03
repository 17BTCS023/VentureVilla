const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/user.js");

router.route("/signup")
.get(UserController.renderSignUpForm)  // Signup Form
.post(wrapAsync(UserController.signUp)); // Sign up 

router.route("/login")
.get(UserController.renderLoginForm)  // Login Form
.post(saveRedirectUrl ,passport.authenticate('local', {failureRedirect : '/login', failureFlash : true }) , UserController.Login);  // Log in

router.get("/logout", UserController.logOut);

module.exports = router;