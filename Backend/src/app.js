const express = require('express')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes.js')
const foodRoutes = require('./routes/food.routes.js')
const foodPartnerRoutes = require('./routes/food-partner.routes.js')
const menuRoutes = require('./routes/menu.routes.js')
const orderRoutes = require('./routes/order.routes.js')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/food-partner', foodPartnerRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)

module.exports = app