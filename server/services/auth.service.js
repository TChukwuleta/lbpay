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
        await comparePassword(password, user)
        return user 
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const updateBalance = async () => {
    try {
        // Update the User's balance with the transaction amount if the invoice is settled

        // Create a transaction log for it
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const comparePassword = async (password, user) => {
    try {
        const result = await bcrypt.compare(password, user.password)
        if(!result) throw new ApiError(400, "Invalid email or password")
        return result
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const getUsers = async (criteria = {}, options = {}) => {
    try {
        const { sort = {createdAt: -1 }, limit, page } = options
        const _limit = parseInt(limit, 10)
        const _page = parseInt(page, 10)
        const users = await User.find(criteria)
        .sort(sort)
        .limit(_limit)
        .skip(_limit * (_page -1))
        return { users, page: _page }
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email })
        if(!user) throw new ApiError(400, "Invalid user")
        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const getUserById = async (_id) => {
    try {
        const user = await User.findOne({ _id })
        if(!user) throw new ApiError(400, "Invalid user")
        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const validateToken = (req, res, next) => {
    const bearerHeader = req.headers.authorization
    if(!bearerHeader) throw new ApiError(400, "You need to attach a token")
    const bearer = bearerHeader.split(" ")
    const [, token] = bearer
    req.token = token
    jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if(err){
            const errorCode = err.code || 500
            const errorMessage = err.message || err
            return res.status(errorCode).send({
                message: `${errorMessage}`
            })
        }
        else{
            req.user = authData.user
            next()
        }
    })
}

const updateUserById = async (userId, updateBody) => {
    try {
        const user = await User.findById(userId)
        if(!user) throw new ApiError(400, "User not found")
        if(updateBody.email){
            const check = await User.findById(userId)
            if(check) throw new ApiError(400, "Email already taken")
        }
        Object.assign(user, updateBody)
        await user.save()
        return user
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const emailVerification = async (data) => {
    try {
        let user = await User.findOne({ email: data.email, pin: data.pin })
        if(!user) throw new ApiError(400, "Invalid user")
        user = await updateUserById(user._id, { accountConfirmed: true, status: "Active" })
        return user
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

const updatePassword = async (data) => {
    try {
        const user = await User.findOne({ email: data.email })
        if(!user) throw new ApiError(400, "Invalid email or password")
        await comparePassword(data.oldPassword, user)
        const hashedPassword = await bcrypt.hash(data.newPassword, 10)
        await updateUserById(user.id, { password: hashedPassword })
    } catch (error) {
        throw new ApiError(error.code || 500, error.message || error)
    }
}

module.exports = {
    register,
    login,
    getUsers,
    getUserByEmail,
    getUserById,
    validateToken,
    updateUserById,
    emailVerification,
    updatePassword
}