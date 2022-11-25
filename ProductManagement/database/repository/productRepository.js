const { ProductModel } = require("../models")
const { APIError, BadRequestError } = require("../../utils/app-error")

class ProductRepository{
    
    async CreateProduct({ name, description, type, unit, price, avaialble, supplier, banner }){
        try {
            const product = new ProductModel({
                name, description, type, unit, price, avaialble, supplier, banner
            })
            const productResult = await product.save()
            return productResult
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Create Product')
        }
    }

    async Products(){
        try {
            return await ProductModel.find()
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Get Products')
        }
    }

    async FindById(id){
        try {
            return await ProductModel.findById(id)
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Get Product')
        }
    }

    async FindByCategory(category){
        try {
            const products = await ProductModel.find({ type: category })
            return products
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Product by Category')
        }
    }

    async FindSelectedProducts(selectedIds){
        try {
            const products =  await ProductModel.find().where('_id').in(selectedIds.map(_id => _id)).exec()
            return products
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Get Product')
        }
    }
}

module.exports = ProductRepository