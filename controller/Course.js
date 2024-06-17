const Course = require("../models/Course")
const Tag = require("../models/Tags")
const User = require("../models/User")
const upladImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config();

// createCourse handler function
const createCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check for instructor
        const userId = req.user.id; // stored in paylod in auth middleware
        const instructorDetails = await User.findById({ userId })
        console.log(instructorDetails);
        // TODO: verify that userId and instructorDetails._id are same or not ???

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found ",
            })
        }

        // check given tag is valid or not
        const tagDetails = await Tag.findById({ tag })
        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Tag Details not found ",
            })
        }

        // upload image to cloudinary
        const thumbnailImage = await upladImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })

        // add the new course to the user schema of instructor because he has created a new course
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true }
        )
        // TO do home work
        // add the new course to the tag schema
        await Tag.findByIdAndUpdate(
            { _id: tagDetails._id },
            {
                $push: {
                    course: newCourse._id
                }
            },
            { new: true },
        )

        return res.status(200).json({
            success: true,
            message: "Course created SuccessFully",
            data: newCourse
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "fail to create course",
            error: error.message
        })
    }
}

// getAllCourses handler function
exports.showAllCourses = async (req, res) => {
    try {
        // TODO: change the below statement  incrementally
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            ratingAndReviews: true,
            studentsEnrolled: true
        })
        .populate("instructor")
        .exec();

        return res.status(200).json({
            success:true,
            message:"data for all courses fetched successfully",
            data:allCourses
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "can not fetch  course Data",
            error: error.message
        })
    }
}