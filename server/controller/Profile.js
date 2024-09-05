const { default: mongoose } = require("mongoose");
const Profile = require("../models/Profile")
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Course = require("../models/Course");

exports.updateProfile = async (req, res) => {
    try {
        // fetch data 
        const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;
        // find user id 
        const id = req.user.id // middleware
        // validation
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // find profile 
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;

        // update profile
        const profileDetails = await Profile.findById(profileId)
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber
        profileDetails.gender = gender
        await profileDetails.save();

        //  we can also do like this
        // const profileDetails = await Profile.findByIdAndUpdate(
        //     {_id: new mongoose.Types.ObjectId(profileId)},
        //     {
        //         gender:gender,
        //         dateOfBirth:dateOfBirth,
        //         about:about,
        //         about:about,
        //         contactNumber:contactNumber,

        //     },
        //     {new:true}
        // ) 

        const updatedUserDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec()
        //return res
        return res.status(200).json({
            success: true,
            message: "profile updated successfully",
            profileDetails,
            updatedUserDetails
        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "unable to update profile Details, pls try again",
            error: error.message
        })
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        // get id 
        const id = req.user.id
        // validation
        const userDetails = await User.findById({ _id: id }).populate("courses").exec()
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            })
        }
        // delete profile
        // Delete Assosiated Profile with the User 
        // NOTE we used here "new mongoose.Types.ObjectId()" to convert string into object;
        const profileId = userDetails.additionalDetails;
        const deletedProfile = await Profile.findByIdAndDelete(profileId)
        // TODO: before deleting the user also delete it from studentEnrolled from Course schema 

        for (const courseId of userDetails.courses) {
            await Course.findByIdAndUpdate(courseId,
                {
                    $pull: {
                        studentsEnrolled: id
                    }
                },
                { new: true })
        }
        // also delete all course progress related with user 
        // await CourseProgress.deleteMany({ userId: id })
        await CourseProgress.deleteMany({ _id: { $in: userDetails.courseProgress } }) // observe it carefully
      

        // Now delete User 
        const deletedUser = await User.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "profile deleted successfully",
            // deletedProfile,
            // deletedUser
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted please try again",
            error: error.message
        })
    }
}

exports.getUserDetail = async (req, res) => {
    try {
        const id = req.user.id
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: userDetails
        })
    }
    catch (error) {
        console.log("ERROR:-", error)
        console.log("ERROR MESSAGE:-", error.message)
        return res.status(500).json({
            success: false,
            message: "unable to fectch user data , please try again",
            error: error.message
        })
    }
}

//updateDisplayPicture
exports.updateDisplayPicture = async (req, res) => {
    try {

        const id = req.user.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const image = req.files.pfp;
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found",
            });
        }
        const uploadDetails = await uploadImageToCloudinary(
            image,
            process.env.FOLDER_NAME
        );
        console.log(uploadDetails);

        const updatedImage = await User.findByIdAndUpdate({ _id: id }, { image: uploadDetails.secure_url }, { new: true });

        res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: updatedImage,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

}


// exports.getEnrolledCourses=async (req,res) => {
// 	try {
//         const id = req.user.id;
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }
//         const enrolledCourses = await User.findById(id).populate({
// 			path : "courses",
// 				populate : {
// 					path: "courseContent",
// 			}
// 		}
// 		).populate("courseProgress").exec();
//         // console.log(enrolledCourses);
//         res.status(200).json({
//             success: true,
//             message: "User Data fetched successfully",
//             data: enrolledCourses,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        const userDetails = await User.findById(userId)
            .populate(
                {
                    path: "courses",
                    populate: {
                        path: "courseContent",
                        populate: {
                            path: "subSection"
                        }
                    }
                }
            )
            .populate("courseProgress")
            .exec()

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: `could Not find user with userid: ${userId}`
            })
        }

        return res.status(200).json({
            success: true,
            message: "successfully found enrolled courses",
            data: userDetails
        })

    }
    catch (error) {
        console.log("error Message:- ", error.message)
        return res.status(500).json({
            success: false,
            message: "unable to get enrolled Courses , please try again",
        })
    }
}


exports.instructorDashboard = async (req, res) => {
    try {
        const id = req.user.id
        const courseDetails = await Course.find({ instructor: id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course?.studentsEnrolled?.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields

            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated
            }
            return courseDataWithStats;

        })

        return res.status(200).json({
            success: true,
            message: "successfull get course details for all created courses by a patricular instructor",
            data: courseData
        })
    }
    catch (error) {
        console.log("error Message:- ", error.message)
        return res.status(500).json({
            success: false,
            message: "unable to get all Course details created by an instructor ",
        })
    }
}