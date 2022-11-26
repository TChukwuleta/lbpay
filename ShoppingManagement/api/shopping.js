const ShoppingService = require('../services/shoppingService')
const UserAuth = require('./middlewares/auth')

module.exports = (app) => {
    const service = new ShoppingService()

    app.post('/shopping/order', UserAuth, async (req, res, next) => {
        const { _id } = req.user
        const { txNumber } = req.body
        try {
            const { data } = await service.PlaceOrder({ _id, txNumber })
        } catch (error) {
            next(error)
        }
    })

    app.get('/shopping/orders', UserAuth, async (req, res, next) => {
        const { _id } = req.user
        try {
            //
        } catch (error) {
            next(error)
        }
    })

    app.ger('/shopping/get', UserAuth, async (req, res, next) => {
        const { _id } = req.user
        try {
            //
        } catch (error) {
            next(error)
        }
    })
}