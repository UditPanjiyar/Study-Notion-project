const User = require("../models/User");
const mailSender = require("../utils/mailSender")
const bcryptjs = require("bcryptjs");
const crypto = require("crypto")


// reset password token -> it generate token and send URL with Token to the user;

exports.resetPasswordToken = async (req, res) => {

    try {
        // get email from reqbody
        const email = req.body.email;

        // check user for this email, email validation
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.json(
                {
                    success: false,
                    message: "Your email is not registred with us"
                }
            )
        }

        // generate token
        // const token = crypto.randomUUID();
                    //  (OR)
        const token = crypto.randomBytes(20).toString("hex");  

        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 3600000,
            },
            { new: true } // return updated doc. in res.
        );

        // create url 
      
        const url = `http://localhost:3000/update-password/${token}`;

        // send mail contaning url
        await mailSender(email, "Password Reset Link", `Password Reset Link ${url}`)

        const updatedUser = await User.findOne({email:email})

        return res.json({
            success: true,
            message: "email sent successfully pls check email and change password ",
            data:updatedUser
        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong while sending reset password",
            error:error.message
        })
    }
}


exports.resetPassword = async (req, res) => {

    try {
        //data fetch 
        const { password, confirmPassword, token } = req.body;
        // validation
        if (password !== confirmPassword) {
            return res.status(200).json({
                success: false,
                message: "Password and Confirm Password Does not Match"
            })
        }

        // get user details from database using token
        const userDetails = await User.findOne({ token: token })

        // if no entry - Invalid token
        if (!userDetails) {
            return res.json({
                success: false,
                message: 'Token is invalid',
            })
        }

        //token time check
        if (userDetails.resetPasswordExpires > Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired, please regenerate your token"
            })
        }
        // hash password 
        const hashedPassword = await bcryptjs.hash(password, 10)

        // update password
        await User.findOneAndUpdate(
            { token: token },
            {
                password: hashedPassword
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "password reset successful"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong while sending reset password",
            error:error.message
        })
    }

}