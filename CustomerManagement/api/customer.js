const CustomerService = require("../services/customerService")
const UserAuth = require("./middlewares/auth")
const customerValidation = require('../policies/authPolicy')
const { validate } = require('../utils')
const router = require('express').Router()

const service = new CustomerService()

module.exports = (app) => {
    app.post('/signup', async (req,res,next) => {
        try {
            const { username, email, password, phone } = req.body;
            const { data } = await service.SignUp({ username, email, password, phone}); 
           return res.json(data);
            
        } catch (err) {
            next(err)
        }
    });

    app.post('/login',  async (req,res,next) => {
        try {
            const { email, password } = req.body;
            const { data } = await service.SignIn({ email, password});
            return res.json(data);

        } catch (err) {
            next(err)
        }
    });

    app.post('/address', UserAuth, async (req,res,next) => {
        try {
            const { _id } = req.user;
            const { street, postalCode, city,country } = req.body;
            const { data } = await service.AddNewAddresss( _id ,{ street, postalCode, city,country});
            return res.json(data);
        } catch (err) {
            next(err)
        }
    });
     

    app.get('/profile', UserAuth ,async (req,res,next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetProfile({ _id });
            return res.json(data);
            
        } catch (err) {
            next(err)
        }
    });

    app.get('/shopping-details', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user
            const { data } = await service.GetShoppingDetails(_id)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })

    app.get('/wishlist', UserAuth, async (req, res, next) => {
        try {
            const { _id } = req.user
            const { data } = await service.GetWishlist(_id)
            return res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    })
}