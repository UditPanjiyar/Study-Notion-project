const RatingAndReview = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;

        // fetch data
        const { rating, review, courseId } = req.body;
        // check if user is enrolled or not
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } },
        });
        // this can also be do like this
        /* 
            if(courseDetails.studentsEnrolled.includes(userId))
            {
            return res.status(401).json({
                success: false,
                message: "student is already enrolled in the course"
                })
                }
                */
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "student is not enrolled in the course",
            });
        }
        // check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            return res.status(404).json({
                success: false,
                message: "Course is already reviewed by user",
            });
        }

        //create rating and review

        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });
        // update course with this rating/review

        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                },
            },
            { new: true }
        );
        // console.log(updatedCourseDetails);

        return res.status(200).json({
            success: true,
            message: "ratingAndReview  is created successfully",
            ratingReview,
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,

        });
    }
};

exports.getAverageRating = async (req, res) => {
    try {
        // get courseId
        const courseId = req.body.courseId;
        // calculate avg rating

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                },
            },
        ]);

        // return rating
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }
        // if no rating review exists
        return res.status(200).json({
            success: true,
            message: "Average rating is 0 , no rating is given till now",
            averageRating: 0,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllRating = async (reeq, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                // select: "firstName, lastName, email, image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
