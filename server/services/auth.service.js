const { User } = require("../models")
const bcrypt = require("bcryptjs")
const ApiError = require("../helper/ApiError")
const jwt = require("jsonwebtoken")


const register = async (data) => {
    try {
        let user = await User.findOne({ email: data.email })
        if(user){
            const err = {
                code: 400,
                message: "A youngster with this email already exist"
            }
            throw err
        }
        data.password = await bcrypt.hash(data.password, 10)
        user = await User.create(data)
        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const login = async (email, password) => {
    try {
        const user = await User.findOne({ email })
        if(!user) throw new ApiError(400, "Invalid email or password")
        if(!user.accountConfirmed) throw new ApiError(400, "Account is not yet activated")
        await bcrypt.compare(password, user)
        return user 
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const comparePassword = async (password, user) => {

}

module.exports = {
    register,
    login
}