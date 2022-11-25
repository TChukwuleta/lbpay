const mongoose = require("mongoose")
const schema = mongoose.Schema

const customerSchema = new schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    cart: [{
        product: {
            _id: { type: String, require: true },
            name: { type: String },
            banner: { type: String },
            price: { type: Number }
        },
        unit: {
            type: Number,
            require: true
        }
    }],
    wishlist: [{
        _id: { type: String, require: true },
        name: { type: String },
        description: { type: String },
        available: { type: Boolean },
        banner: { type: String },
        price: { type: Number }
    }],
    orders: [{
        _id: { type: String, require: true },
        amount: { type: String },
        date: { type: Date, default: Date.now()},
        description: { type: String },
        available: { type: Boolean },
        banner: { type: String },
        price: { type: Number }
    }],
    password: {
        type: String,
        required: true
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        require: true
    }],
    salt: String,
    phone: String
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.password
            delete ret.salt
            delete ret.__v
        }
    },
    timestamps: true
})

module.exports = mongoose.model("customer", customerSchema)