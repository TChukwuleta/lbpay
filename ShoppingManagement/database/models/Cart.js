const mongoose = require('mongoose')
const schema = mongoose.Schema

const cartSchema = new schema ({
    customerId: {
        type: String
    },
    items: [{
        product: {
            _id: { type: String, require: true },
            name: { type: String },
            description: { type: String },
            type: { type: String },
            banner: { type: String },
            price: { type: Number },
            unit: { type: Number },
            supplier: { type: String },
        },
        unit: {
            type: Number,
            require: true 
        }
    }]
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v
        }
    },
    timestamps: true
})

module.exports = mongoose.model('cart', cartSchema)