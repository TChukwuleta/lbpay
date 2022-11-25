const express = require('express')
require('dotenv').config()
const { databaseConnection } = require('./database')
const lbpayapp = require('./app')

const PORT =  process.env.PORT

const StartServer = async () => {
    const app = express()
    await databaseConnection()
    app.get('/', (req, res) => {
        res.status(200).send({
            message: "Welcome to LBPay"
        })
    })
    await lbpayapp(app)
    app.listen(PORT, () => {
        console.log(`Speak Lord, your servant is listening on port ${PORT}`)
    })
    .on('error', (err) => {
        console.log(err)
        process.exit()
    })
}
 
StartServer()