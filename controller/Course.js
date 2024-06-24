const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config();

// createCourse handler function
exports.createCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, category, tag } = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // Check if the user is an instructor
        const userId = req.user.id; // stored in paylod in auth middleware
        const instructorDetails = await User.findById(userId, { accountType: "Instructor" })

        // TODO: verify that userId and instructorDetails._id are same or not ???

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found ",
            })
        }

        // check given category is valid or not
        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details not found ",
            })
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
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
        // add the new course to the category schema
        await Category.findByIdAndUpdate(
            { _id: categoryDetails._id },
            {
                $push: {
                    courses: newCourse._id
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
exports.getAllCourses = async (req, res) => {
    try {
        // TODO: change the below statement  incrementally
        const allCourses = await Course.find({ status: "Published" }, {
            courseName: true,
            price: true,
            thumbnail: true,
            ratingAndReviews: true,
            studentsEnrolled: true
        })
            .populate("instructor")
            .exec();

        return res.status(200).json({
            success: true,
            message: "data for all courses fetched successfully",
            data: allCourses
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

// getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        // find course details
        const courseDetails = await Course.findOne({ _id: courseId })
            .populate(
                {
                    path: "instructor",
                    populate: {
                        path: "additionalDetails"
                    }
                }
            )
            .populate("category")
            .populate("ratingAndReviews")
            .populate(
                {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    }
                }
            )
            .exec();

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `could not find the course with ${courseId} `
            })
        }

        return res.status(200).json({
            success: true,
            message: "Course Details fetched SuccessFully",
            data: courseDetails
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