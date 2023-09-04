const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const ProductModel = require("../model/Product");

class Product {
    async getAll(req, res) {
        try {
            const products = await ProductModel.find({}).limit(50).exec();
            if (products.length > 0) {
                return res.status(200).send(
                    success("Successfully received all products", {
                        result: products,
                        total: products.length,
                    })
                );
            }
            return res.status(400).send(failure("No products were found"));
        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .send(failure("Internal server error"));
        }
    }
}

module.exports = new Product();