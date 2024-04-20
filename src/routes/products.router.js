const express = require('express')
const router = express.Router()

const ProductManager = require('./productManager.js')
const manager = new ProductManager("./products.json")

router.get('/products', (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        let allProducts = manager.getProducts()
        if (!isNaN(limit) && limit > 0) {
            allProducts = allProducts.slice(0, limit)
        }
        res.json(allProducts)
    } catch (error) {
        console.error("Error not Product found",error)
        res.status(500).json({message: "Product not found"})
    }
})
router.get('/products/:pid', (req, res) => {  
    const productId = parseInt(req.params.pid)
    const product = manager.getProductById(productId)
    if (product) {
        res.json({product})
    }else{  
        res.status(404).json({message: 'Product not found'})
    }
    
})


module.exports = router
