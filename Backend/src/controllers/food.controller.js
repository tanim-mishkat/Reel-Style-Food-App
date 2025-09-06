const foodModel = require('../models/food.model.js')
const likeModel = require('../models/likes.model.js')
const saveModel = require('../models/save.model.js')
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

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({ message: 'Food Items fetched successfully', foodItems })
}

async function likeFood(req, res) {
    const { foodId } = req.body
    console.log("food controller: ")
    console.log("foodId: ", foodId)
    console.log("req.body: ", req.body)
    console.log("req.params", req.params)


    const user = req.user

    const isAlreadyLiked = await likeModel.findOne({
        food: foodId,
        user: user._id
    })
    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            food: foodId,
            user: user._id
        })
        await foodModel.findOneAndUpdate({ _id: foodId }, { $inc: { likesCount: -1 } })

        res.status(200).json({ message: 'Food unliked successfully' })
    }
    await foodModel.findOneAndUpdate({ _id: foodId }, { $inc: { likesCount: 1 } })
    const like = await likeModel.create({
        food: foodId,
        user: user._id
    })
    res.status(201).json({ message: 'Food liked successfully', like })

}

async function saveFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadySaved = await saveModel.findOne({
        food: foodId,
        user: user._id
    })
    if (isAlreadySaved) {
        await saveModel.deleteOne({
            food: foodId,
            user: user._id
        })
        res.status(200).json({ message: 'Food unsaved successfully' })
    }
    await saveModel.create({
        food: foodId,
        user: user._id
    })
    res.status(201).json({ message: 'Food saved successfully' })

}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood
}

