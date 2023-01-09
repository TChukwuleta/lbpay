const { ShoppingRepository } = require('../database')
const { FormateData } = require('../utils')
const { APIError } = require('../utils/app-error')

class ShoppingService{

    constructor(){
        this.repository = new ShoppingRepository()
    }

    async getCart({ _id }){
        try {
            const cartItem = await this.repository.Cart(_id)
            return FormateData(cartItem)
        } catch (error) {
            throw new APIError('Data not found', error)
        }
    }

    async PlaceOrder(userInput){
        const { _id, txnNumber } = userInput
        // Verify the txn with the payment logs

        try {
            const orderResult = await this.repository.CreateNewOrder(_id, txnNumber)
            return FormateData(orderResult)
        } catch (error) {
            throw new APIError('Data not found', error)
        }
    }

    async GetOrders(customerId){
        try {
            const orders = await this.repository.Orders(customerId)
            return FormateData(orders)
        } catch (error) {
            throw new APIError('Data not found', error)
        }
    }

    // Get order details method

    async ManageCart(customerId, item, qty, isRemove){
        try {
            const cartResult = await this.repository.AddCartItem(customerId, item, qty, isRemove)
            return FormateData(cartResult)
        } catch (error) {
            throw new APIError('Data not found', error)   
        }
    }

    async SubscribeEvents(payload){
        const {event, data } = payload
        const { userId, product, qty }= data
        switch(event){
            case 'ADD_TO_CART':
                this.ManageCart(userId,product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId,product,qty, true);
                break;
            default:
                break;
        }
    }

    async GetOrderPayload(userId, order, event){
        if(order){
            const payload = {
                event,
                data: { userId, order }
            }
            return FormateData(payload)
        }
        else{
            return FormateData({ error: 'No order available' })
        }
    }
}

module.exports = ShoppingService