const express = require('express');
const router = express.Router(); 
const User = require('../model/user'); 
const { createHmac } = require('crypto');  // Ensure this is imported
const { createusertoken } = require('../services/authuntication');

router.get("/signin", (req, res) => {
    res.render("signin");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});
router.post("/signup", async (req, res) => {
    const { fullName, password, email } = req.body;

    try {
        await User.create({ fullName, password, email });
        res.render('signin')
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).render('signup', { error: "Error creating user. Please try again." });
    }
});
router.post("/signin", async function (req, res) {
    const { password, email } = req.body;

    try {
        const token = await User.mismatch(email, password);  // Await for the mismatch function
        
        if (token) {
            
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Token will expire in 1 hour 

            return res.redirect('/');  // Render the home template
        } else {
            return res.render('signin', { error: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).render('signin', { error: "An error occurred during sign-in" });
    }
});


router.get("/logout", (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;
