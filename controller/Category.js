const Category = require("../models/Category")

// create Category kaa handler function
exports.createCategory = async (req, res) => {
    try {
        // fetch data
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "all fields are required"
            })
        }

        //create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description
        })
        console.log(categoryDetails)

        //return response
        return res.status(200).json({
            success: true,
            message: "Category created successfully",
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

// getAlllCategory handler function
exports.showAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({}, { name: true, description: true })
        return res.status(200).json({
            success: true,
            message: "all category return successfully",
            allCategory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.messsage
        })
    }
}