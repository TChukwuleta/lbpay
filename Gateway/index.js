const express = require('express')
require('dotenv').config()
const cors = require('cors')
const proxy = require('express-http-proxy')
const PORT = process.env.PORT
const app = express()

app.use(cors("*"))
app.use(express.json())

app.use('/', proxy(`${process.env.CustomerUrl}`))
app.use('/product', proxy(`${process.env.ProductUrl}`))
app.use('/shipping', proxy(`${process.env.ShippingUrl}`))


app.listen(PORT, () => {
    console.log(`Speak Lord, your gateway is listening on port ${PORT}`)
})