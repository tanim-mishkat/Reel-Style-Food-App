const userModel = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const foodPartnerModel = require('../models/foodpartner.model.js')



// user auth controller

async function registerUser(req, res, next) {
    try {
        const { fullName, email, password } = req.body
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const isUserExist = await userModel.findOne({ email })
        if (isUserExist) {
            return res.status(400).json({ message: 'User already exist' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userModel.create({ fullName, email, password: hashedPassword })

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.cookie('user_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        })
    } catch (error) {
        next(error);
    }
}

async function loginUser(req, res, next) {
    try {
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

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.cookie('user_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        })
    } catch (error) {
        next(error);
    }
}

async function logoutUser(req, res) {
    res.clearCookie('user_token')
    res.status(200).json({ message: 'User logged out successfully' })
}

async function getUserProfile(req, res) {
    const user = req.user
    res.status(200).json({
        message: 'Profile fetched successfully',
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email
        }
    })
}

async function updateUserProfile(req, res) {
    const user = req.user
    const { fullName } = req.body

    const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { fullName },
        { new: true }
    )

    res.status(200).json({
        message: 'Profile updated successfully',
        user: {
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email
        }
    })
}


// food partner auth controller

async function registerFoodPartner(req, res, next) {
    try {


        const { fullName, email, password, contactName, phone, address } = req.body

        if (!fullName || !email || !password || !contactName || !phone || !address) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const isFoodPartnerExist = await foodPartnerModel.findOne({ email })
        if (isFoodPartnerExist) {
            return res.status(400).json({ message: 'Food partner already exist' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Handle profile image upload if provided
        let profileImgUrl = null
        if (req.file) {
            try {
                const storageService = require('../services/storage.service.js')
                const filename = `partner-${Date.now()}-${req.file.originalname}`
                const uploadResult = await storageService.uploadFile(req.file.buffer, filename)
                profileImgUrl = uploadResult.url

            } catch (uploadError) {
                console.error('Image upload failed:', uploadError)
                // Continue with registration even if image upload fails
                profileImgUrl = null
            }
        }

        const foodPartner = await foodPartnerModel.create({
            fullName,
            email,
            password: hashedPassword,
            contactName,
            phone,
            address,
            profileImg: profileImgUrl
        })

        const token = jwt.sign({ id: foodPartner._id, role: 'partner' }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.cookie('partner_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })

        res.status(201).json({
            message: 'Food partner registered successfully',
            foodPartner: {
                _id: foodPartner._id,
                fullName: foodPartner.fullName,
                email: foodPartner.email,
                contactName: foodPartner.contactName,
                phone: foodPartner.phone,
                address: foodPartner.address,
                profileImg: foodPartner.profileImg
            }
        })
    } catch (error) {
        console.error('Registration error:', error);
        next(error);
    }
}

async function loginFoodPartner(req, res, next) {
    try {
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

        const token = jwt.sign({ id: foodPartner._id, role: 'partner' }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.cookie('partner_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        res.status(200).json({
            message: 'Food partner logged in successfully',
            foodPartner: {
                _id: foodPartner._id,
                fullName: foodPartner.fullName,
                email: foodPartner.email
            }
        })
    } catch (error) {
        next(error);
    }
}


async function logoutFoodPartner(req, res) {
    res.clearCookie('partner_token')
    res.status(200).json({ message: 'Food partner logged out successfully' })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}