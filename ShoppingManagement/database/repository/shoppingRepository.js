const { OrderModel, CartModel } = require('../models')
const { v4: uuidv4 } = require('uuid')
const { APIError, BadRequestError, STATUS_CODES } = require('../../utils/app-error')

class ShoppingRepository{
    
    // Payment
    async Orders(customerId){
        try {
            const orders = await OrderModel.find({ customerId }).populate('items,product')
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to fetch Orders')
        }
    }

    async Cart(customerId){
        try {
            const cartItems = await CartModel.find({ customerId })
            if(cartItems){
                return cartItems
            }
            throw new Error('Data not found')
        } catch (error) {
            throw new APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to fetch cart items')
        }
    }

    async AddCartItem(customerId, item, qty, isRemove){
        try {
            const cart = await CartModel.findOne({customerId})
            const { _id } = item
            if(cart){
                let isExist = false
                let cartItems = cart.items
                if(cartItems.length > 0){
                    cartItems.map(item => {
                        if(item.product._id.toString() === _id.toString()){
                            if(isRemove){
                                cartItems.splice(cartItems.indexOf(item), 1)
                            }else{
                                item.unit = qty
                            }
                            isExist = true
                        }
                    })
                }
                if (!isExist && !isRemove) {
                    cartItems.push({product: {...item}})
                }
                cart.items = cartItems
                return await cart.save()
            }
            else{
                return await CartModel.create({
                    customerId,
                    items: [{ product: {...item}, unit: qty}]
                })
            }
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Customer')
        }
    }

    async CreateNewOrder(customerId, txnId){
        // Check transaction for payment status
        try {
            const cart = await CartModel.findOne({ customerId })
            if(cart){
                let amount = 0
                let cartItems = cart.items
                if(cartItems.length > 0){
                    // Process order
                    cartItems.map(item => {
                        amount += parseInt(item.product.price) * parseInt(item.unit)
                    })
                    const orderId = uuidv4()
                    const order = new OrderModel({
                        orderId,
                        customerId,
                        amount, 
                        txnId,
                        status: 'received',
                        items: cartItems
                    })
                    cart.items = []
                    const orderResult = await order.save()
                    await cart.save()
                    return orderResult
                }
            }
            return {}
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to create a new order')
        }
    }
}


module.exports = ShoppingRepository