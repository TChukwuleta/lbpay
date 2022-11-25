const CustomerService = require("../services/customerService")
const UserAuth = require("./middlewares/auth")
const customerValidation = require('../policies/authPolicy')
const { validate } = require('../utils')
const router = require('express').Router()

const service = new CustomerService()

module.exports = (app) => {
    app.post('/customer/signup', async (req,res,next) => {
        try {
            const { username, email, password, phone } = req.body;
            const { data } = await service.SignUp({ username, email, password, phone}); 
           return res.json(data);
            
        } catch (err) {
            next(err)
        }
    });

    app.post('/customer/login',  async (req,res,next) => {
        try {
            const { email, password } = req.body;
            const { data } = await service.SignIn({ email, password});
            return res.json(data);

        } catch (err) {
            next(err)
        }
    });

    app.post('/customer/address', UserAuth, async (req,res,next) => {
        try {
            const { _id } = req.user;
            const { street, postalCode, city,country } = req.body;
            const { data } = await service.AddNewAddresss( _id ,{ street, postalCode, city,country});
            return res.json(data);
        } catch (err) {
            next(err)
        }
 

    });
     

    app.get('/customer/profile', UserAuth ,async (req,res,next) => {
        try {
            const { _id } = req.user;
            const { data } = await service.GetProfile({ _id });
            return res.json(data);
            
        } catch (err) {
            next(err)
        }
    });
}