const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection= async (req,res)=>{
    try{
        // data fetch
        const {sectionName,courseId} = req.body;

        // data validation
        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        const newSection = await Section.create({sectionName});
        
        // update course with section objectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {courseId},
            {
                $push:{
                    courseContent:newSection._id
                }
            },
            {new:true}
        )
        // TODO: use populate to replace section/sub-subsections both in the updatedCourseDetails
        // .populate()
        // .exec()
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails
        })


    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "unable to create section, pls try again",
            error: error.message
        })
    }
}

exports.updateSection = async (req,res)=>{
    try{

        // data input
        const {sectionName,sectionId} = req.body;
        // data validation
        if(!sectionName || !sectionId)
        {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }
        //update data
        const upatedSectionDetails = await Section.findByIdAndUpdate(
            {sectionId},
            {sectionName:sectionName},
            {new:true}
        )
        // return res
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            // upatedSectionDetails
        })

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "fail to update section",
            error: error.message
        })
    }
}

exports.deleteSection = async (req,res)=>{
    try{
        // get Id - assuming that we are sending Id in params
        const {sectionId} = req.params
        // use findByIdAnddelete
        const deletedSectionDetails = await Section.findByIdAndDelete({sectionId});
        // return res
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
            // deletedSectionDetails
        })
    //TODO: Q-> if section is deleted then does we also need to delete its objectId from Course Schema
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "fail to delete section",
            error: error.message
        })
    }
}