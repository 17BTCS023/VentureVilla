const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/user.js");

router.get("/signup", UserController.renderSignUpForm);

router.post("/signup", wrapAsync(UserController.signUp));

router.get("/login", UserController.renderLoginForm);

router.post("/login", saveRedirectUrl ,passport.authenticate('local', {failureRedirect : '/login', failureFlash : true }) , UserController.Login);

router.get("/logout", UserController.logOut);

module.exports = router;