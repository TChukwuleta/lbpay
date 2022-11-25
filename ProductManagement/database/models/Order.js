const mongoose = require('mongoose')
const schema = mongoose.Schema

const orderSchema = new schema({
    orderId: String,
    customerId: String,
    amount: Number,
    status: String,
    txnId: String,
    items: [{
        product: {
            type: schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        unit: {
            type: Number,
            require: true
        }
    }]
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.__v
        }
    },
    timestamps: true
})

module.exports = mongoose.model('order', orderSchema)