const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const RatingAndReviews = require("../models/RatingAndReviews")

// 1.a createCourse handler function
// exports.createCourse = async (req, res) => {
//     try {
//         // fetch data, whatYouWillLearn = Benefits of the course
//         const { courseName, courseDescription, whatYouWillLearn, price, category, tag } = req.body;

//         // get thumbnail
//         const thumbnail = req.files.thumbnailImage;

//         //validation
//         if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             })
//         }

//         // Check if the user is an instructor
//         const userId = req.user.id; // stored in paylod in auth middleware
//         const instructorDetails = await User.findById(userId, { accountType: "Instructor" })

//         // TODO: verify that userId and instructorDetails._id are same or not ???

//         if (!instructorDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Instructor Details not found ",
//             })
//         }

//         // check given category is valid or not
//         const categoryDetails = await Category.findById(category)
//         if (!categoryDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category Details not found ",
//             })
//         }

//         // upload image to cloudinary
//         const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

//         // create an entry for new course
//         const newCourse = await Course.create({
//             courseName,
//             courseDescription,
//             instructor: instructorDetails._id,
//             whatYouWillLearn,
//             price,
//             tag,
//             category: categoryDetails._id,
//             thumbnail: thumbnailImage.secure_url,
//         })

//         // add the new course to the user schema of instructor because he has created a new course
//         await User.findByIdAndUpdate(
//             { _id: instructorDetails._id },
//             {
//                 $push: {
//                     courses: newCourse._id
//                 }
//             },
//             { new: true }
//         )
//         // TO do home work
//         // add the new course to the category schema
//         await Category.findByIdAndUpdate(
//             { _id: categoryDetails._id },
//             {
//                 $push: {
//                     courses: newCourse._id
//                 }
//             },
//             { new: true },
//         )

//         return res.status(200).json({
//             success: true,
//             message: "Course created SuccessFully",
//             data: newCourse
//         })

//     }
//     catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "fail to create course",
//             error: error.message
//         })
//     }
// }

//1.b
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status,
      instructions,
    } = req.body;

    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnailImage;

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    console.log(thumbnailImage);
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions: instructions,
    });

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

//2. getAllCourses handler function
exports.getAllCourses = async (req, res) => {
  try {
    // TODO: change the below statement  incrementally
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "can not fetch  course Data",
      error: error.message,
    });
  }
};

//3. getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    // find course details
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate({
        "path": "ratingAndReviews",
        populate: {
          path: "user"
        },
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `could not find the course with ${courseId} `,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course Details fetched SuccessFully",
      data: courseDetails,
    });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "fail to create course",
      error: error.message,
    });
  }
};

//4.Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 5. Function to get all courses of a particular instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Find all courses of the instructor
    const allCourses = await Course.find({ instructor: userId });

    // Return all courses of the instructor
    res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    // Handle any errors that occur during the fetching of the courses
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

//6. Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {

      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });

      // const userDetails = User.findById(studentId);
      // const [courseProgressArray] = userDetails.courseProgress;
      // for(const courseProgressId of courseProgressArray)
      // {
      //   await CourseProgress.findByIdAndDelete(courseProgressId, {courseID : courseId}) 
      // }

    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }


    // delete Rating And Reviews
    const ratingAndReviews = course.ratingAndReviews;
    for (const rating of ratingAndReviews) {
      await RatingAndReviews.findByIdAndDelete({ _id: rating });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    //Delete course id from Category
    await Category.findByIdAndUpdate(course.category._id, {
      $pull: { courses: courseId },
    });

    //Delete course id from Instructor
    await User.findByIdAndUpdate(course.instructor._id, {
      $pull: { courses: courseId },
    });



    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

7; //get full course details
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userID: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : ["none"],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 8. mark lecture as completed
exports.markLectureAsComplete = async (req, res) => {
  const { courseId, subSectionId, userId } = req.body;

  if (!courseId || !subSectionId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const progressAlreadyExists = await CourseProgress.findOne({
      userID: userId,
      courseID: courseId,
    });

    if (!progressAlreadyExists) {
      return res.status(404).json({
        success: false,
        message: "CourseProgress does not exist",
      });
    }

    const completedVideos = progressAlreadyExists.completedVideos;

    if (!completedVideos.includes(subSectionId)) {
      await CourseProgress.findOneAndUpdate(
        {
          userID: userId,
          courseID: courseId,
        },
        {
          $push: { completedVideos: subSectionId },
        }
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Lecture already marked as complete",
      });
    }

    // await CourseProgress.findOneAndUpdate(
    //   {
    //     userId: userId,
    //     courseID: courseId,
    //   },
    //   {
    //     completedVideos: completedVideos,
    //   }
    // );

    return res.status(200).json({
      success: true,
      message: "Lecture marked as complete",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
