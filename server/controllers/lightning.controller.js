const ApiError = require("../helper/ApiError")
const catchAsync = require("../helper/catchAsync")
const { lightningService, authService } = require("../services")
require("dotenv").config()

const lndConnect = catchAsync(async (req, res) => {
    const user = await authService.getUserById(req.user._id)
    if(!user) throw new ApiError(400, "No user found")
    const connection = await lightningService.connectRpc()
    res.status(201).send({
        message: "LND connection was successful",
        data: { connection }
    })
})

const lndInvoice = catchAsync(async (req, res) => {
    const user = await authService.getUserById(req.user._id)
    if(!user) throw new ApiError(400, "No user found")
    const createLndInvoice = await lightningService.createInvoice(req.body)
    res.status(201).send({
        message: "Lightning invoice generated successfully",
        data: { createLndInvoice }
    })
})

module.exports = {
    lndConnect,
    lndInvoice
}