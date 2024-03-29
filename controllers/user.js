const User = require("../models/user.js");

module.exports.renderSignUpForm =(req, res) =>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res, next) => {
    try {
            let {username, email, password} = req.body;
            const newUser = new User({email, username});
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            req.login(registeredUser, 
                (err) => {
                    if(err) {
                        return next(err);
                    }else{
                        req.flash("success", "Welcome to VentureVilla!");
                        res.redirect("/listings");
                    }
                });
        }
        catch (error) {
            req.flash("error", "user already signed up");
            res.redirect("/signup");
        }
    };

    module.exports.renderLoginForm = (req, res) => {
        res.render("users/login.ejs");
    };

    module.exports.Login = async(req, res) => {
        req.flash("success", "Welcome back! You are logged in!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };

    module.exports.logOut = (req, res, next) => {
        req.logOut((err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "You are now logged out! ");
            res.redirect("/listings");
        })
    };

