const mongoose = require('mongoose')
const schema = mongoose.Schema 

const productSchema = new schema({
    name: String,
    description: String,
    banner: String,
    type: String,
    unit: Number,
    price: Number,
    available: Boolean,
    supplier: String
})

module.exports = mongoose.model('product', productSchema)