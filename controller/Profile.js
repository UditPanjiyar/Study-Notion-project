const Profile = require("../models/Profile")
const User = require("../models/User")

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
        const userDetails = await User.findById({ id });
        const profileId = userDetails.additionalDetails;

        const profileDetails = Profile.findById({ profileId })
        // update profile
        profileDetails.gender = gender
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber
        profileDetails.save();

        // can we also do like this
        /*
        const profileDetail = Profile.findByIdAndUpdate(
            {profileId},
            {gender:gender},
            {dateOfBirth:dateOfBirth},
            {about:about},
            {contactNumber:contactNumber},
            {new:true}
        ) 
        */

        //return res
        return res.status(200).json({
            success: true,
            message: "profile updated successfully",
            profileDetails
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
        const userDetails = User.findById({ id })
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            })
        }
        // delete profile
        const profileId = userDetails.additionalDetails;
        const deletedProfile = await Profile.findByIdAndDelete({ profileId })
        // TODO: before deleting the user also delete it from studentEnrolled from Course schema 
        
        // delete User 
        const deletedUser = await User.findByIdAndDelete({ id })
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
        })
    }
}

exports.getAllUserDetail = async(req,res)=>{
    try{
        const id = req.user.id
        const userDetails = await User.findById({id}).populate("additionalDetails").exec();
       
        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
        })
    }
    catch(error)
    {
        console.log(error)
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "unable to fectch user data , please try again",
        })
    }
}