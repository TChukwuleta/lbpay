const mongoose = require("mongoose")
require("dotenv").config()

module.exports = async() => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Database connected")
    } catch (error) {
        console.log("Error...")
        console.log(error)
        process.exit(1) 
    }
}