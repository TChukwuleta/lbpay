const ApiError = require("../helper/ApiError")
const catchAsync = require("../helper/catchAsync")
const qrCode = require("../helper/qrcode")
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


const qrCoderHelper = catchAsync(async (req, res) => {
    const codeGeneration = await qrCode.uploadFile("Shoemaker")
    res.status(201).send({
        message: "LND connection was successful",
        data: { codeGeneration }
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

const lookUpInvoiceWithHash = catchAsync(async (req, res) => {
    const user = await authService.getUserById(req.user._id)
    if(!user) throw new ApiError(400, "No user found")
    const lookUpHash = await lightningService.lookUpInvoiceHash(req.body)
    res.status(201).send({
        message: "Invoice lookup was successful",
        data: { lookUpHash }
    })
})

const lookUpInvoiceWithInvoice = catchAsync(async (req, res) => {
    const user = await authService.getUserById(req.user._id)
    if(!user) throw new ApiError(400, "No user found")
    const lookUpInvoiceHash = await lightningService.invoiceLookup(req.body.invoice)
    res.status(201).send({
        message: "Invoice lookup was successful",
        data: { lookUpInvoiceHash }
    })
})

const payLndInvoice = catchAsync(async (req, res) => {
    const user = await authService.getUserById(req.user._id)
    if(!user) throw new ApiError(400, "No user found")
    const payinvoice = await lightningService.payInvoice(req.body.invoice)
    res.status(201).send({
        message: "Invoice payment was successful",
        data: { payinvoice }
    })
}) 

module.exports = {
    lndConnect, 
    lndInvoice,
    lookUpInvoiceWithHash,
    lookUpInvoiceWithInvoice,
    payLndInvoice,
    qrCoderHelper
}