const ApiError = require("../helper/ApiError")
const catchAsync = require("../helper/catchAsync")
const pick = require("../helper/pick")
const { authService, tokenService } = require("../services")
require("dotenv").config()

const register = catchAsync(async (req, res) => {
    const token = Math.floor(1000 + Math.random() * 9000)
    var userRequest = {
        ...req.body,
        pin: token.toString()
    }
    const user = await authService.register(userRequest)
    const tokens = await tokenService.generateAuthTokens(user, true)
    res.status(201).send({
        message: "User registration was successful",
        data: {
            user,
            token: tokens.access.token
        }
    })
})

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body
    const user = await authService.login(email, password)
    const token = await tokenService.generateAuthTokens(user)
    res.status(201).send({
        message: "Login was successful",
        data: {
            user,
            token: token.access.token
        }
    })
})


const emailVerification = catchAsync(async (req, res) => {
    try {
        const user = await authService.emailVerification(req.body)
        delete user.password
        res.send({
            message: "Acount activated successfullt",
            user
        })
    } catch (error) {
        const message = error.message || error;
        const code = error.code || 500;
        throw new ApiError(code, message);
    }
})

const updatePassword = catchAsync(async (req, res) => {
    await authService.updatePassword(req.body)
    res.status(201).send({
        message: "Password updated successfully",
        data: {}
    })
})

const updateUserById = catchAsync(async (req, res) => {
    if(req.body.password) throw new ApiError(400, "You cannot update your password here")
    const user = await authService.updateUserById(req.user._id, req.body)
    res.status(201).send({
        message: "User updated successfully",
        data: user
    })
})

const getUser = catchAsync(async (req, res) => {
    let user
    if(req.query.user){
        user = JSON.parse(JSON.stringify(await authService.getUserById(req.query.user)))
    }
    else{
        user = JSON.parse(JSON.stringify(await authService.getUserById(req.user._id)))
    }
    res.status(200).send({
        message: "User details fetched successfully",
        data: user
    })
})

const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ["type"])
    const options = pick(req.query, ["sortby", "limit", "page"])
    const { users, page } = await authService.getUsers(JSON.parse(JSON.stringify(filter)), options)
    const count = await authService.count(filter)
    res.status(200).send({
        message: "Users fetched successfully",
        data: {
            count, 
            currentPage: page,
            users
        }
    })
})

module.exports = {
    register,
    login,
    emailVerification,
    updatePassword,
    getUser,
    getUsers,
    updateUserById
}