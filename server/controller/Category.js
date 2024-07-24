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
exports.getAllCategories = async (req, res) => {
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

exports.categoryPageDetails = async (req, res) => {
    try {
        // get category Id
        const { categoryId } = req.body;
        // get courses for specified categoryId
        const selectedCategory = await Category.findOne(categoryId)
            .populate("courses")
            .exec()

        // Handle the case when the category is not found
        if (!selectedCategory) {
            res.status(404).json({
                success: false,
                message: "Data not found"
            })
        }

        // Handle the case when there are no courses
        if (await selectedCategory.courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }

        // get courses for different category 
        const differentCategoriesList = await Category.findById(
            { _id: { $ne: categoryId } }
        )
        // differentCategory will ba an array
        const len = differentCategoriesList.length
        
        // let index = Math.floor(Math.random() * len)
        const oneRandomSelectedCategory = await Category.findById(differentCategoriesList[Math.floor(Math.random() * len)]._id)
            .populate({
                path: "courses",
                match: { status: Published }
            })
            .exec()

        //get top selling course  
        //TODO- HW

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategoriesList,
                // top selling course 
            }
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