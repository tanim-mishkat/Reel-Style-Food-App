const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes.js')
const dotenv = require('dotenv').config()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)

module.exports = app