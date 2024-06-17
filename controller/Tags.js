const Tag = require("../models/Tags")

// create tag kaa handler function
exports.createTag = async (req, res) => {
    try {
        // fetch data
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400), json({
                success: false,
                message: "all fields are required"
            })
        }

        //create entry in DB
        const tagDetails = await Tag.create({
            name: name,
            description: description
        })
        console.log(tagDetails)

        //return response
        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.messsage
        })
    }
}

// getAlllTags handler function
exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, { name: true, description: true })
        return res.status(200).json({
            success: true,
            message: "all tags return successfully",
            allTags
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.messsage
        })
    }
}