const SubSection = require("../models/SubSection")
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
    try {
        // fetch data 
        const { sectionId, title, description } = req.body;
        // extract video/file
        const video = req.files.videoFile
        // validation
        if (!sectionId || !title || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        console.log(uploadDetails);

        // create a subSection
        const SubSectionDetails = await SubSection.create({
            title: title,
            description: description,
            timeDuration: `${uploadDetails.duration}`,
            videoUrl: uploadDetails.secure_url
        })
        // update section with this sub section objectId (OR)
        // Update the corresponding section with the newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: {
                    subSection: SubSectionDetails._id
                }
            },
            { new: true }
        )
            .populate("subSection")
            .exec()
        // todo log updated section here, after adding populate query

        // return res
        return res.status(200).json({
            success: true,
            message: "subSection created successfully",
            data: updatedSection
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "unable to create subsection, pls try again",
            error: error.message
        })
    }
}

exports.updateSubSection = async (req, res) => {
    try {
        // data input 
        const { sectionId, subSectionId, title, description } = req.body;
        const video = req.files.videoFile 
        // data validation
        if (!sectionId || !subSectionId || !title || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        // update data 
        // TODO: do we need to update video also which is uploaded on cloudinary
        const uploadDetails = uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        const updatedSubSection = await SubSection.findByIdAndUpdate(
            { _id: subSectionId },
            {
                title: title,
                timeDuration: `${uploadDetails.duration}`,
                description: description,
                videoUrl: uploadDetails.secure_url,
            },
            { new: true }
        )

        const updateSection = await Section.findById(sectionId)
            .populate("subSection")
            .exec()
        // return res 
        return res.status(500).json({
            success: true,
            message: "SubSection updated successfully",
            updateSection,
            updatedSubSection
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "unable to update subsection, pls try again",
            error: error.message
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        // fetch subSection Id
        const { subSectionId, sectionId } = req.body;

        // TODO: before deleting subSection  does we also need to delete its objectId from section Schema -->> and the ans is yes 


        const deletedsection = await Section.findByIdAndUpdate(
            sectionId ,
            {
                $pull: {
                    subSection: subSectionId
                },
            },
            { new: true }
        )

        // findByIdAndDelete
        const deletedSubSection = await SubSection.findByIdAndDelete({ _id: subSectionId });

        const updatedSection = await Section.findById(sectionId)
            .populate("subSection")
        // .exec()
        // return res
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "fail to delete subSection",
            error: error.message
        })
    }
}