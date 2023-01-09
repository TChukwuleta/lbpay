const { CustomerRepository } = require("../database")
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require("../utils")
const { APIError, BadRequestError } = require("../utils/app-error")

// All business logic will be here
class CustomerService {
    constructor(){
        this.repository = new CustomerRepository()
    }

    async SignIn(userInputs){
        const { email, password } = userInputs
        try {
            const existingCustomer = await this.repository.FindCustomer({ email })
            if(existingCustomer){
                const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt)
                if(validPassword){
                    const token = await GenerateSignature({ email: existingCustomer.email, _id: existingCustomer._id })
                    return FormateData({ id: existingCustomer._id, token })
                }
                throw new Error("Invalid Email and Password")
            }
            throw new Error("Invalid email and password")
        } catch (error) {
            throw new APIError('Data not found', error)   
        }
    }

    async SignUp(userInputs){
        const { username, email, password, phone } = userInputs
        try {
            let salt = await GenerateSalt()
            let userPassword = await GeneratePassword(password, salt)
            const existingCustomer = await this.repository.FindCustomer({ email })
            if(existingCustomer){
                throw new APIError("Customer already exist")
            }
            const newCustomer = await this.repository.CreateCustomer({ username, email, password: userPassword, phone, salt })
            const token = await GenerateSignature({ email, _id: newCustomer._id })
            return FormateData({ id: newCustomer._id, token })
        } catch (error) {
            throw new APIError("Data not found", error)
        }
    }

    async AddNewAddresss(_id, userInputs){
        const { street, postalcode, city, country } = userInputs
        try {
            const newAddress = await this.repository.CreateAddress({ _id, street, postalcode, city, country })
            return FormateData(newAddress)
        } catch (error) {
            throw new APIError('Data not found', error)
        }
    }

    async GetProfile(id){
        try {
            const existingCustomer = await this.repository.FindCustomerById({ id })
            return FormateData(existingCustomer)
        } catch (error) {
            throw new APIError('Data not found', error)
        }
    }

    async GetShoppingDetails(id){
        try {
            const existingCustomer = await this.repository.FindCustomerById({ id })
            if(existingCustomer){
                return FormateData(existingCustomer)
            }
            return FormateData({ msg: 'Error' })
        } catch (error) {
            throw new APIError('Data Not found', error)
        }
    }

    async GetWishlist(customerId){
        try {
            const wishlistItems = await this.repository.Wishlist(customerId)
            return FormateData(wishlistItems)
        } catch (error) {
            throw new APIError('Data not found', error)
        }
    }

    async AddToWishlist(customerId, product){
        try {
            const wishlistResult = await this.repository.AddWishlistItem(customerId, product)
            return FormateData(wishlistResult)
        } catch (error) {
            throw new APIError('Data not found', error)
        }
    }

    async ManageCart(customerId, product, qty, isRemove){
        try {
            const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove)
            return FormateData(cartResult)
        } catch (error) {
            throw new APIError('Data not found', error)
        }
    }

    async ManageOrder(customerId, order){
        try {
            const orderResult = await this.repository.AddOrderToProfile(customerId, order)
            return FormateData(orderResult)
        } catch (error) {
            throw new APIError('Data not found', error)
        }
    }

    async SubscribeEvents(payload){
        const {event, data } = payload
        const { userId, product, order, qty }= data
        switch(event){
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                this.AddToWishlist(userId,product)
                break;
            case 'ADD_TO_CART':
                this.ManageCart(userId,product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId,product,qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId,order);
                break;
            default:
                break;
        }
    }
}

module.exports = CustomerService  