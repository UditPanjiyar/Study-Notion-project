const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config;

const mailSender = require("../utils/mailSender");
const { passwordUpdate } = require("../mail/templete/passwordUpdate");

// send OTP
exports.sendOTP = async (req, res) => {
    try {
        // fetch email from req ki body
        const { email } = req.body;

        // HW do validation for email is correct or not

        // check if user already exist
        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "user already registered",
            });
        }
        // generate OTP
        // can we use any other package which will generate unique otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("otp generated: ", otp);

        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };
        // create an  entry for OTP in DB
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body", otpBody);

        res.status(200).json({
            success: true,
            message: "otp send successfully",
            otp,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.signUp = async (req, res) => {
    try {
        // fetch data from req ki body
        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            contactNumber,
            otp,
        } = req.body;

        // validate karlo
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp
        ) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        //match password
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirmPassword does not match please try again",
            });
        }

        // check user already exist or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        // find most recent otp
        const recentOTP = await OTP.find({ email })
            .sort({ createdAt: -1 })
            .limit(1);
        console.log(recentOTP);
        //validate OTP
        if (recentOTP.length === 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP NOT Found",
            });
        } else if (otp !== recentOTP[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "OTP not matching || Invalid otp",
            });
        }

        // hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // create entry in DB

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName},${lastName}`,
        });

        return res.status(200).json({
            success: true,
            message: "user is registered successfully",
            user,
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({
            success: false,
            message: `User cannot registered please try again  Error: ${error.message}`,
        });
    }
};

exports.login = async (req, res) => {
    try {
        // get data from req body
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        let user = await User.findOne({ email }).populate("additionalDetails");
        // check for registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user is not registerd with us Please SignUp to to continue ",
            });
        }

        if (await bcryptjs.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() +  3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "user logged in successfully",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "password is not matching",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "login failure",
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        // validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(401).json({
                success: false,
                messsage: "All fields are required",
            });
        }
        // fetch user detail
        const userDetails = await User.findById(userId);
        // check oldpassword is correct or not entered by user
        const isPasswordMatch = await bcryptjs.compare(
            oldPassword,
            userDetails.password
        );
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                messsage: "wrong password",
            });
        }
        // password matching or not
        if (newPassword !== confirmNewPassword) {
            return res.status(401).json({
                success: false,
                messsage: "newPassword and confirmNewPassword are not matching",
            });
        }
        const encryptedPassword = await bcryptjs.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            { _id: userId },
            { password: encryptedPassword },
            { new: true }
        );

        // send notification email
        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Regarding Password Update",
                passwordUpdate(
                    updatedUserDetails.email,
                    `${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email Sent successfully", emailResponse.response);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        //return res
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error occured while updating password",
            error: error.message,
        });
    }
};
