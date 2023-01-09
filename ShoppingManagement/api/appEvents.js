const ShoppingService = require('../services/shoppingService')

const service = new ShoppingService()
module.exports = (app) => {
    app.use('/app-events', async (req, res, next) => {
        const { payload } = req.body
        service.SubscribeEvents(payload)
        console.log("================ Shopping Service received Event ==================")
        return res.status(200).json(payload)
    })
}