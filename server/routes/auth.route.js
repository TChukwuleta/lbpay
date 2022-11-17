const express = require("express")
const validate = require("../helper/validate")
const authController = require("../controllers/auth.controller")
const authValidation = require("../policies/auth.policy")
const { authService } = require("../services")
const router = express.Router()

router.post(
    "/register",
    [validate(authValidation.register)],
    authController.register
)

router.post(
    "/login",
    [validate(authValidation.login)],
    authController.login
)

router.post(
    "/verifyaccount",
    [validate(authValidation.confirmAccount)],
    authController.emailVerification
)

router.post(
    "/update/password",
    [validate(authValidation.updatePassword), authService.validateToken],
    authController.updatePassword
)

router.post(
    "/update",
    [validate(authValidation.updateUser), authService.validateToken],
    authController.updateUserById
)

router.get(
    "/getone",
    [authService.validateToken],
    authController.getUser
);

router.get(
    "/getall",
    [authService.validateToken],
    authController.getUsers
);

module.exports = router