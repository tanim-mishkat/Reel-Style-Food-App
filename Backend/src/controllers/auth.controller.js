const userModel = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

module.exports = { registerUser }