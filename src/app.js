const express = require('express')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const app = express()
const PORT = 8080

// Middleware para parsear JSON y URL-encoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas para productos
app.use('/api/products', productRoutes)

// Rutas para carritos
app.use('/api/carts', cartRoutes)

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`)
})
