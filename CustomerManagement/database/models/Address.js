const mongoose = require("mongoose")
const schema = mongoose.Schema

const addressSchema = new schema({
    street: String,
    postalCode: String,
    city: String,
    country: String
})

module.exports = mongoose.model('address', addressSchema)