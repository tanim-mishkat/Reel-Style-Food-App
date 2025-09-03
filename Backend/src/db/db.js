const mongoose = require('mongoose');


function connectDB() {
    mongoose.connect('mongodb://localhost:27017/food-view')
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => {
            console.error('Error connecting to MongoDB', err);
        })
}

module.exports = connectDB;