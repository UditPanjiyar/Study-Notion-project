const express = require("express")
const router = express.Router()

// Routes for deleteprofile , updateprofile ,getAllUserdetails , getEnrolledCourse , updateDisplayPicture;

const { auth, isInstructor } = require("../middleware/auth")
const { updateProfile, deleteAccount, getUserDetail, updateDisplayPicture,getEnrolledCourses, instructorDashboard} = require("../controller/Profile")


// ********************************************************************************************************
//                                      Profile routes                                                    *
// ********************************************************************************************************

router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetail", auth, getUserDetail)

router.get("/getEnrolledCourses", auth, getEnrolledCourses)                  // Get Enrolled Courses
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/getInstructorDashboardDetails", auth, isInstructor, instructorDashboard)

module.exports = router