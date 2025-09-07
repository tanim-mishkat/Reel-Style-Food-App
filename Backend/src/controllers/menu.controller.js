const menuModel = require('../models/menu.model.js')

async function createMenuItem(req, res) {
    const menuItem = await menuModel.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        prepTime: req.body.prepTime ? JSON.parse(req.body.prepTime) : undefined,
        isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === 'true' : true,
        photoUrl: req.body.photoUrl,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({ message: 'Menu item created successfully', menuItem })
}

async function getMyMenuItems(req, res) {
    const menuItems = await menuModel.find({ foodPartner: req.foodPartner._id })
    res.status(200).json({ message: 'Menu items fetched successfully', menuItems })
}

async function getMenuItems(req, res) {
    const { id } = req.params
    const menuItems = await menuModel.find({ foodPartner: id })
    res.status(200).json({ message: 'Menu items fetched successfully', menuItems })
}

async function updateMenuItem(req, res) {
    const { id } = req.params
    const foodPartner = req.foodPartner

    const menuItem = await menuModel.findOne({ _id: id, foodPartner: foodPartner._id })
    if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found or unauthorized' })
    }

    const updateData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        prepTime: req.body.prepTime ? JSON.parse(req.body.prepTime) : undefined,
        isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === 'true' : undefined,
        photoUrl: req.body.photoUrl,
        tags: req.body.tags ? JSON.parse(req.body.tags) : undefined
    }

    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key])

    const updatedMenuItem = await menuModel.findByIdAndUpdate(id, updateData, { new: true })
    res.status(200).json({ message: 'Menu item updated successfully', menuItem: updatedMenuItem })
}

async function deleteMenuItem(req, res) {
    const { id } = req.params
    const foodPartner = req.foodPartner

    const menuItem = await menuModel.findOne({ _id: id, foodPartner: foodPartner._id })
    if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found or unauthorized' })
    }

    await menuModel.findByIdAndDelete(id)
    res.status(200).json({ message: 'Menu item deleted successfully' })
}

module.exports = {
    createMenuItem,
    getMyMenuItems,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem
}