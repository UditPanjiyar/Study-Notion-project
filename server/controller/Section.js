const Section = require("../models/Section")
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

// exports.createSection = async (req, res) => {
//     try {
//         // data fetch
//         const { sectionName, courseId } = req.body;

//         // data validation
//         if (!sectionName || !courseId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "all fields are required"
//             })
//         }
//         const newSection = await Section.create({ sectionName });

//         // update course with section objectId
//         const updatedCourseDetails = await Course.findByIdAndUpdate(
//             { _id: courseId },
//             {
//                 $push: {
//                     courseContent: newSection._id
//                 }
//             },
//             { new: true }
//         )
//             // TODO: use populate to replace section/sub-subsections both in the updatedCourseDetails
//             .populate(
//                 {
//                     path: "courseContent",
//                     populate: {
//                         path: "subSection"
//                     }
//                 }
//             )
//             .exec()

//         return res.status(200).json({
//             success: true,
//             message: "Section created successfully",
//             updatedCourseDetails
//         })

//     }
//     catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "unable to create section, pls try again",
//             error: error.message
//         })
//     }
// }

exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}
		
		const ifcourse= await Course.findById(courseId);
		if (!ifcourse) {
			return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};



exports.updateSection = async (req, res) => {
    try {

        // data input
        const { sectionName, sectionId, courseId } = req.body;
        // data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        //update data
        const updatedSectionDetails = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName: sectionName },
            { new: true }
        )

        if (!updatedSectionDetails) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        const updatedCourse = await Course.findById(courseId)
            .populate(
                {
                    path: "courseContent",
                    populate: {
                        path: "subSection"
                    }
                }).exec()

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // return res
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            updatedCourse
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "fail to update section",
            error: error.message
        })
    }
}

exports.deleteSection = async (req, res) => {
    try {
        // get Id - assuming that we are sending Id in params
        // const { sectionId} = req.params
        const { sectionId, courseId } = req.body
        // step 1 first delete section object id from course 
        const course = await Course.findByIdAndUpdate(
            courseId,
            {
                $pull: {
                    courseContent: sectionId
                }
            }
        )
        // step 2 delete all subSection from section
        const section = await Section.findById(sectionId )
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section Not Found"
            })
        }
        // delete Sub Section
        const deletedSubSection = await SubSection.deleteMany({ _id: { $in: section.subSection } }) // observe it carefully
        // delete section
        const deletedSectionDetails = await Section.findByIdAndDelete(sectionId);

        //find the updated course and return 
        const updatedCourse = await Course.findById(courseId).populate({                               //here there is no use of const course , its only store updated course;
            path: "courseContent",                                                               // if you also write without  "const course = " then it also work;
            populate: {
                path: "subSection"
            }
        })
        .exec();

        // return res
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            updatedCourse,
            deletedSectionDetails,
            deletedSubSection
        })
        //TODO: Q-> if section is deleted then does we also need to delete its objectId from Course Schema
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "fail to delete section",
            error: error.message
        })
    }
}