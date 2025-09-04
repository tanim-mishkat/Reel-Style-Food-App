const userModel = require('../models/user.model.js')
const foodPartnerModel = require('../models/foodpartner.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



// user auth controller

async function registerUser(req, res) {
    const { fullName, email, password } = req.body
    if (!fullName || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const isUserExist = await userModel.findOne({ email })
    if (isUserExist) {
        return res.status(400).json({ message: 'User already exist' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await userModel.create({ fullName, email, password: hashedPassword })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        }
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        }
    })
}

async function logoutUser(req, res) {
    res.clearCookie('token')
    res.status(200).json({ message: 'User logged out successfully' })
}


// food partner auth controller

async function registerFoodPartner(req, res) {
    const { fullName, email, password } = req.body
    if (!fullName || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const isFoodPartnerExist = await foodPartnerModel.findOne({ email })
    if (isFoodPartnerExist) {
        return res.status(400).json({ message: 'Food partner already exist' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const foodPartner = await foodPartnerModel.create({ fullName, email, password: hashedPassword })

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

    res.status(201).json({
        message: 'Food partner registered successfully',
        foodPartner: {
            _id: foodPartner._id,
            fullName: foodPartner.fullName,
            email: foodPartner.email
        }
    })
}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foodPartner = await foodPartnerModel.findOne({ email })
    if (!foodPartner) {
        return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password)
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.status(200).json({
        message: 'Food partner logged in successfully',
        foodPartner: {
            _id: foodPartner._id,
            fullName: foodPartner.fullName,
            email: foodPartner.email
        }
    })
}


async function logoutFoodPartner(req, res) {
    res.clearCookie('token')
    res.status(200).json({ message: 'Food partner logged out successfully' })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}