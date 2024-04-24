const express = require('express')
const router = express.Router()
const ProductManager = require('../productManager.js')

const manager = new ProductManager("./src/data/products.json")

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        let allProducts = await manager.getProducts()
        if (!isNaN(limit) && limit > 0) {
            allProducts = allProducts.slice(0, limit)
        }
        res.json(allProducts)
    } catch (error) {
        console.error("Error al obtener productos:", error)
        res.status(500).json({ message: "Error al obtener productos" })
    }
})

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid)
    try {
        const product = await manager.getProductById(productId)
        res.json({ product })
    } catch (error) {
        res.status(404).json({ message: 'Producto no encontrado' })
    }
})

router.post('/', async (req, res) => {
    const newProduct = req.body
    try {
        const product = await manager.addProduct(newProduct);
        res.json({ message: 'Producto agregado exitosamente', product })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid)
    const updatedFields = req.body
    try {
        const product = await manager.updateProduct(productId, updatedFields)
        res.json({ message: 'Producto actualizado exitosamente', product })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid)
    try {
        await manager.deleteProduct(productId)
        res.json({ message: 'Producto eliminado exitosamente' })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
module.exports = router
