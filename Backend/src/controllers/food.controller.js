const foodModel = require('../models/food.model.js')
const storageService = require('../services/storage.service.js')
const { v4: uuid } = require('uuid')

async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({ message: 'Food item created successfully', food: foodItem })
}

module.exports = {
    createFood
}