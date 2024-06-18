const SubSection = require("../models/SubSection")
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async (req, res) => {
    try {
        // fetch data 
        const { sectionId, title, description, timeDuration } = req.body;
        // extract video/file
        const video = req.files.videoFile
        // validation
        if (!sectionId || !title || !description || !timeDuration) {
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
            timeDuration: timeDuration,
            video: uploadDetails.secure_url
        })
        // update section with this sub section objectId
        const updatedSection = await Section.findByIdAndUpdate(
            { sectionId },
            {
                $push: {
                    subSection: SubSectionDetails._id
                }
            },
            { new: true }
        )
        // todo log updated section here, after adding populate query
        // .populate()
        // .exec()

        // return res
        return res.status(200).json({
            success:true,
            message:"subSection created successfully",
            updatedSection
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

exports.updateSubSection = async (req,res)=>{
    try{
        // data input 
        const {subSectionId, title, timeDuration, description} = req.body;
        // data validation
        if(!subSectionId || !title || !timeDuration || ! description)
        {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        // update data 
        // TODO: do we need to update video also which is uploaded on cloudinary
        const updatedSubSection = await subSection.findByIdAndUpdate(
            {subSectionId},
            {title:title},
            {timeDuration:timeDuration},
            {description:description},
            {new:true}
        )
        // return res 
        return res.status(500).json({
            success:true,
            message:"SubSection updated successfully",
            // updatedSubSection
        })
    }
    catch(error)
    {

    }
}

exports.deleteSubsection = async (req,res)=>{
    try{
        // fetch subSection Id
        const {subSectionId} = req.body;
        
        // findByIdAndDelete
        const deletedSubSection = await SubSection.findByIdAndDelete({subSectionId});
    // TODO: if subSection is deleted then does we also need to delete its objectId from section Schema
    
        // return res
        return res.status(200).json({
            success:true,
            message:"SubSection deleted successfully",
            deletedSubSection
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "fail to delete subSection",
            error: error.message
        })
    }
}