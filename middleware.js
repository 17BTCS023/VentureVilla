module.exports.isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error", "Login to add a listing!");
        res.redirect("/login");
    }
    next();
}