const express = require('express')
const app = express()

const productsRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`)
})