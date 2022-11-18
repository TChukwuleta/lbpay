const express = require("express")
const router = express.Router()

const authRouter = require("./auth.route")
const lndRouter = require("./lnd.routes")

router.use("/user", authRouter)
router.use("/lnd", lndRouter)

module.exports = router