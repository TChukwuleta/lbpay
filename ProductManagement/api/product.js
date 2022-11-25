const ProductService = require('../services/productService')
const UserAuth = require('./middlewares/auth')
const { PublishCustomerEvent, PublishShoppingEvent } = require('../utils')

const service = new ProductService()
module.exports = (app) => {
    app.post('/product/create', async(req, res, next) => {
        try {
            const { name, description, type, unit, price, available, supplier, banner } = req.body
            const { data } = await service.CreateProduct({ name, description, type, unit, price, available, supplier, banner })
            return res.json(data)
        } catch (error) {
            next(error)
        }
    })

    app.get('product/category/:type', async (req, res, next) => {
        const type = req.params.type
        try {
            const { data } = await service.GetProductsByCategory(type)
            return res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    })

    app.get('/product/:id', async (req, res, next) => {
        const productId = req.params.id
        try {
            const productResult = await service.GetProductById(productId)
            return res.status(200).json(productResult)
        } catch (error) {
            next(error)
        }
    })

    app.post('/product/ids', async (req, res, next) => {
        try {
            const { ids } = req.body
            const products = await service.GetSelectedProducts(ids)
            return res.status(200).json(products)
        } catch (error) {
            next(error)
        }
    })

    app.put('/wishlist',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        // Get payload to send to customer service
        const { data } = await service.GetProductPayload(_id, { productId: req.body._id}, "ADD_TO_WISHLIST")
        try {
            return res.status(201).json(data.data.product)
        } catch (err) {
            
        }
    });
    
    app.delete('/wishlist/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const productId = req.params.id;

        try {
            const product = await service.GetProductById(productId);
            const wishlist = await customerService.AddToWishlist(_id, product)
            return res.status(200).json(wishlist);
        } catch (err) {
            next(err)
        }
    });


    app.put('/cart',UserAuth, async (req,res,next) => {
        
        const { _id, qty } = req.body;
        
        try {     
            const product = await service.GetProductById(_id);
    
            const result =  await customerService.ManageCart(req.user._id, product, qty, false);
    
            return res.status(200).json(result);
            
        } catch (err) {
            next(err)
        }
    });
    
    app.delete('/cart/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        try {
            const product = await service.GetProductById(req.params.id);
            const result = await customerService.ManageCart(_id, product, 0 , true);             
            return res.status(200).json(result);
        } catch (err) {
            next(err)
        }
    });

    //get Top products and category
    app.get('/', async (req,res,next) => {
        //check validation
        try {
            const { data} = await service.GetProducts();        
            return res.status(200).json(data);
        } catch (error) {
            next(err)
        }
        
    });
}