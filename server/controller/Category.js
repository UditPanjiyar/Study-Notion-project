const Category = require("../models/Category")
const Course = require("../models/Course");

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
exports.showAllCategories = async (req, res) => {
	try {
		const allCategorys = await Category.find({}, { name: true, description: true })
		return res.status(200).json({
			success: true,
			message: "all category return successfully",
			data: allCategorys
		})
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: error.messsage
		})
	}
}


// exports.categoryPageDetails = async (req, res) => {
//     try {
//         // get category Id
//         const { categoryId } = req.body;
//         // get courses for specified categoryId
//         const selectedCategory = await Category.findOne(categoryId)
//             .populate("courses")
//             .exec()

//         // Handle the case when the category is not found
//         if (!selectedCategory) {
//             res.status(404).json({
//                 success: false,
//                 message: "Data not found"
//             })
//         }

//         // Handle the case when there are no courses
//         if (await selectedCategory.courses.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No courses found for the selected category.",
//             })
//         }

//         // get courses for different category 
//         const differentCategoriesList = await Category.findById(
//             { _id: { $ne: categoryId } }
//         )
//         // differentCategory will ba an array
//         const len = differentCategoriesList.length

//         // let index = Math.floor(Math.random() * len)
//         const oneRandomSelectedCategory = await Category.findById(differentCategoriesList[Math.floor(Math.random() * len)]._id)
//             .populate({
//                 path: "courses",
//                 match: { status: Published }
//             })
//             .exec()

//         //get top selling course  
//         //TODO- HW

//         return res.status(200).json({
//             success: true,
//             data: {
//                 selectedCategory,
//                 differentCategoriesList,
//                 // top selling course 
//             }
//         })

//     }
//     catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: error.messsage
//         })
//     }
// }

//add course to category
exports.categoryPageDetails = async (req, res) => {
	try {
		const { categoryId } = req.body;

		// Get courses for the specified category
		const selectedCategory = await Category.findById(categoryId) //populate instuctor and rating and reviews from courses
			.populate({
				path: "courses",
				match: { status: "Published" },
				populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
			})
			.exec();
		// console.log(selectedCategory);
		// Handle the case when the category is not found
		if (!selectedCategory) {
			console.log("Category not found.");
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}
		// Handle the case when there are no courses
		if (selectedCategory.courses.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		const selectedCourses = selectedCategory.courses;

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		}).populate({
			path: "courses",
			match: { status: "Published" },
			populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
		});
		let differentCourses = [];
		for (const category of categoriesExceptSelected) {
			differentCourses.push(...category.courses);
		}

		// Get top-selling courses across all categories
		const allCategories = await Category.find().populate({
			path: "courses",
			match: { status: "Published" },
			populate: [{ path: "instructor" }, { path: "ratingAndReviews" }],
		});
		const allCourses = allCategories.flatMap((category) => category.courses);
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);

		res.status(200).json({
			selectedCourses: selectedCourses,
			differentCourses: differentCourses,
			mostSellingCourses: mostSellingCourses,
			success: true,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};


exports.addCourseToCategory = async (req, res) => {
	const { courseId, categoryId } = req.body;
	// console.log("category id", categoryId);
	try {
		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}
		if (category.courses.includes(courseId)) {
			return res.status(200).json({
				success: true,
				message: "Course already exists in the category",
			});
		}
		category.courses.push(courseId);
		await category.save();
		return res.status(200).json({
			success: true,
			message: "Course added to category successfully",
		});
	}
	catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}