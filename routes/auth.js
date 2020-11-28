var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { signup,signin,signout } = require('../controllers/auth');

router.post(
    "/signup",
    [
        check("name","name should be at least 3 char long").isLength({min:3}),
        check("password","password should be at least 3 char long").isLength({min:3}),
        check("email","email is required").isEmail()
    ],
    signup
);

router.post(
    "/signin",
    [
        check("email","email is required").isEmail(),
        check("password","password should be at least 1 char long").isLength({min:1}),
    ],
    signin
);

router.get("/signout",signout);


module.exports = router;
