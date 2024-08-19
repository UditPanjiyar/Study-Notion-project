const express = require("express")
const router = express.Router()
const { contactUs } = require("../controller/ContactUs");

router.post("/contactUs", contactUs);

module.exports = router;
