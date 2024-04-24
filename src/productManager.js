const fs = require('fs').promises

class ProductManager {
    constructor(filePath) {
        this.path = filePath
        this.products = []
        this.loadProducts() 
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8')
            this.products = JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('El archivo de productos no existe. Creando uno nuevo.')
                await this.saveProducts()
            } else {
                console.error('Error al cargar los productos:', error)
            }
        }
    }

    async saveProducts() {
        const data = JSON.stringify(this.products, null, 2)
        try {
            await fs.writeFile(this.path, data)
        } catch (error) {
            console.error('Error al guardar los productos:', error)
            throw error
        }
    }

    async getProducts() {
        await this.loadProducts() 
        return this.products
    }

    async addProduct(newProduct) {
        if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.thumbnail || !newProduct.code || !newProduct.stock) {
            throw new Error('Todos los campos son obligatorios')
        }
        if (this.products.some(product => product.code === newProduct.code)) {
            throw new Error('El código del producto ya existe')
        }
        const product_id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1
        const product = {
            id: product_id,
            status: true,
            title: newProduct.title,
            description: newProduct.description,
            price: newProduct.price,
            thumbnail: newProduct.thumbnail,
            code: newProduct.code,
            stock: newProduct.stock,
            category: newProduct.category
        }
        this.products.push(product)
        await this.saveProducts() 
        console.log("Producto guardado")
        return product
    }

    async getProductById(product_id) {
        await this.loadProducts() 
        const searchProduct = this.products.find(product => product.id === product_id)
        if (!searchProduct) {
            throw new Error('Producto no encontrado')
        }
        return searchProduct
    }

    async updateProduct(productId, updatedFields) {
        const index = this.products.findIndex(product => product.id === productId)
        if (index === -1) {
            throw new Error('Producto no encontrado')
        }
        const updatedProduct = { ...this.products[index], ...updatedFields }
        if (updatedProduct.code && this.products.some(product => product.code === updatedProduct.code && product.id !== productId)) {
            throw new Error('El código del producto ya existe')
        }
        updatedProduct.id = productId
        this.products[index] = updatedProduct
        await this.saveProducts()
        return updatedProduct
    }

    async deleteProduct(productId) {
        const index = this.products.findIndex(product => product.id === productId)
        if (index === -1) {
            throw new Error('Producto no encontrado')
        }
        this.products.splice(index, 1)
        await this.saveProducts()
    }
}

module.exports = ProductManager
