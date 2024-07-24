const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const { courseEnrollmentEmail } = require("../mail/templete/courseEnrollmentEmail")
const { default: mongoose } = require("mongoose")


//capture the payment  and initate the razorpay order 
exports.capturePayment = async (req, res) => {

    // get courseId and User Id
    const { course_id } = req.body;
    const userId = req.user.id
    // validation
    if (!course_id) {
        return res.status(401).json({
            success: false,
            message: "please provide valid course Id"
        })
    }
    // valid course Details
    let course;
    try {
        course = await Course.findById(course_id)
        if (!course) {
            return res.status(401).json({
                success: false,
                message: "Could not find valid course "
            })
        }
        // check whether user already paid for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(401).json({
                success: false,
                message: "student is already enrolled in the course"
            })
        }


    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

    // create order
    const amount = course.price;
    const currency = "INR"

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now().toString()),
        notes: {
            courseId: course_id,
            userId
        }
    }
    try {

        // initiate the payment using razorPay
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
        });
    }

}


exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678"
    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex")

    if (signature === digest) {
        console.log("payment is Authorised")
        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            // fullfill the action

            // find the course and enroll the  student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                {
                    $push: {
                        studentsEnrolled: userId
                    },
                },
                { new: true }
            )
            if (!enrolledCourse) {
                return res.status(401).json({
                    success: false,
                    message: "Course not found"
                })
            }
            console.log(enrolledCourse);
            
            // find the student and add the course 
            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $push: {
                        courses: courseId
                    }
                },
                { new: true }
            )
            console.log(enrolledStudent)

            // send confirmation mail
            const emailResponse = await mailSender(
                enrolledStudent,
                "congratulations",
                "congratulations, You are onboarded into new CodeHelp Course",
            )
            console.log(emailResponse)
            return res.status(400).json({
                success: true,
                message: "signature verified and course Added"
            })

        }
        catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

    }
    else
    {
        return res.status(400).json({
            success:false,
            message: " Invalid request , signature not matching with digest "
        })
    }


}