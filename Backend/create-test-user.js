const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User model
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createTestUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if test user already exists
        const existingUser = await User.findOne({ email: 'test@example.com' });
        if (existingUser) {
            console.log('Test user already exists');
            return;
        }

        // Create test user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const testUser = new User({
            fullName: 'Test User',
            email: 'test@example.com',
            password: hashedPassword
        });

        await testUser.save();
        console.log('Test user created successfully!');
        console.log('Email: test@example.com');
        console.log('Password: password123');

    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createTestUser();