const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("database connected success fully");
    })
    .catch((err)=>{
        console.log("DB connection fail");
        console.log(err);
        process.exit(1);
    })
};