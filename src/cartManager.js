const fs = require('fs').promises

class CartManager {
    constructor(filePath) {
        this.path = filePath
        this.carts = []
        this.loadCarts() // Llama a loadCarts() al instanciar CartManager
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8')
            this.carts = JSON.parse(data)
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('El archivo de carritos no existe. Creando uno nuevo.')
                await this.saveCarts() // Crea el archivo si no existe
            } else {
                console.error('Error al cargar los carritos:', error)
            }
        }
    }

    async saveCarts() {
        const data = JSON.stringify(this.carts, null, 2)
        try {
            await fs.writeFile(this.path, data)
        } catch (error) {
            console.error('Error al guardar los carritos:', error)
            throw error
        }
    }

    async getCarts() {
        await this.loadCarts() // Asegura que los carritos estén cargados
        return this.carts
    }

    async createCart() {
        const newCart = {
            id: this.carts.length + 1,
            products: []
        }
        this.carts.push(newCart)
        await this.saveCarts() // Guarda los carritos después de agregar uno nuevo
        return newCart
    }

    async getCartProducts(cartId) {
        await this.loadCarts() // Asegura que los carritos estén cargados
        const cart = this.carts.find(cart => cart.id === cartId)
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }
        return cart.products
    }

    async addProductToCart(cartId, productId) {
        await this.loadCarts() // Asegura que los carritos estén cargados
        const cart = this.carts.find(cart => cart.id === cartId)
        if (!cart) {
            throw new Error('Carrito no encontrado')
        }
        const existingProduct = cart.products.find(product => product.id === productId)
        if (existingProduct) {
            existingProduct.quantity++ // Incrementa la cantidad si el producto ya está en el carrito
        } else {
            cart.products.push({ id: productId, quantity: 1 }) // Agrega un nuevo producto al carrito si no existe
        }
        await this.saveCarts() // Guarda los carritos después de agregar un producto
    }
}

module.exports = CartManager
