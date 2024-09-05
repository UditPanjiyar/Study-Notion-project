const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templete/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60 * 5
    }

})


// a function to send email
async function sendVerificationEmail(email, otp) {
    try {

        const mailResponse = await mailSender(email, "verification email from study Notion", emailTemplate(otp))
        // await before may be used
        console.log("email sent successfully", mailResponse);


    }
    catch (error) {
        console.log("error occured while sending mail", error);
        throw error;
    }
}

OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema);