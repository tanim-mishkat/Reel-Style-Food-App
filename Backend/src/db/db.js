const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            // Database connected successfully
        }).catch((err) => {
            // Database connection failed
        })
}

module.exports = connectDB;