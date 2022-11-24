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