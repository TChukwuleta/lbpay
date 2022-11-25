const ProductService = require('../../services/productService')

const service = new ProductService()
module.exports = (app) => {
    app.use('/app-events', async (req, res, next) => {
        const { payload } = req.body
        //service.SubscribeEvents(payload)
        console.log("================ Product Service received Event ==================")
        return res.status(200).json(payload)
    })
}