const express = require("express")
const validate = require("../helper/validate")
const lightningController = require("../controllers/lightning.controller")
const { authService } = require("../services")
const lndPolicy = require("../policies/lnd.policy")
const router = express.Router()


router.post(
    '/connect',
    [authService.validateToken],
    lightningController.lndConnect
)

router.post(
    "/generateinvoice",
    [validate(lndPolicy.createInvoice), authService.validateToken],
    lightningController.lndInvoice
)

router.post(
    "/lookuphash",
    [validate(lndPolicy.lookUpHash), authService.validateToken],
    lightningController.lookUpInvoiceWithHash
)

router.post(
    "/lookupinvoice",
    [validate(lndPolicy.lookUpInvoice), authService.validateToken],
    lightningController.lookUpInvoiceWithInvoice
)

router.post(
    "/pay", 
    [validate(lndPolicy.lookUpInvoice), authService.validateToken],
    lightningController.payLndInvoice
)

module.exports = router