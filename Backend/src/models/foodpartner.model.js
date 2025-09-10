const mongoose = require('mongoose')

const foodPartnerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    contactName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    }
},
    { timestamps: true }
)

const foodPartnerModel = mongoose.model('foodPartner', foodPartnerSchema)

module.exports = foodPartnerModel