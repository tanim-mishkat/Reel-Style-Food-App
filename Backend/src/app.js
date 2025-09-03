const express = require('express')


const app = express()

app.get('/', (req, res) => {
    console.log('Hello World')
    res.send(200).json("success")
})

module.exports = app