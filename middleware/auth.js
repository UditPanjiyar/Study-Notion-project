const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//authentication means it verify the token which we had saved in controller (in cookie , and body(user));

exports.auth = async (req, res, next) => {

    try {
        // extract jwt token 
        // pending -- other  ways to fetch token -- bearer token
        const token = req.body.token
            || req.cookies.token
            || req.header("Authorization").replace("Bearer ", "");
        // if token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token missing"
            })
        }
         //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode);
            req.user = decode;
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: 'token is invalid'
            });
        }
        next();


    }
    catch (error) {

        return res.status(401).json({
            success: false,
            message: 'somthing went wrong while verifying the token'
        });
    }
}



exports.isStudent = (req, res, next) => {
    try {
        if (req.user.accountType !== "Student")   //  we had saved accountType in payload in controller(in login when password is checking) and when we decode token in auth to verify the token
            {                                     //  and we done req.user = decode; So accountType is also saved in user 
            return res.status(401).json({
                success: false,
                message: "this is protected route for Students only"
            })
        }
        next();

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching'
        });
    }
}

exports.isInstructor = (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for Instructor only"
            })
        }
        next();

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching'
        });
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "this is protected route for Admin only"
            })
        }
        next();

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching'
        });
    }
}
