const { PublishCustomerEvent } = require('../../ProductManagement/utils')
const ShoppingService = require('../services/shoppingService')
const UserAuth = require('./middlewares/auth')

module.exports = (app) => {
    const service = new ShoppingService()

    app.post('/order', UserAuth, async (req, res, next) => {
        const { _id } = req.user
        const { txNumber } = req.body
        try {
            const { data } = await service.PlaceOrder({ _id, txNumber })
            const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER")
            PublishCustomerEvent(payload)
            return res.status(201).json(data)
        } catch (error) {
            next(error)
        }
    })

    app.get('/orders', UserAuth, async (req, res, next) => {
        const { _id } = req.user
        try {
            const { data } = await service.GetOrders(_id)
            return res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    })

    app.get('cart', UserAuth, async (req, res, next) => {
        const { _id } = req.user
        try {
            const { data } = await service.getCart({ _id })
            return res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    })
}