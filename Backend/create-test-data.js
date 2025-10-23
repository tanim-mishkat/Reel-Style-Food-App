const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const foodPartnerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    profileImg: { type: String }
}, { timestamps: true });

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    video: { type: String, required: true },
    description: { type: String },
    foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'foodPartner' },
    likesCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    price: { type: Number }
}, { timestamps: true });

const FoodPartner = mongoose.model('foodPartner', foodPartnerSchema);
const Food = mongoose.model('food', foodSchema);

async function createTestData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if test partner already exists
        const existingPartner = await FoodPartner.findOne({ email: 'testpartner@example.com' });
        if (existingPartner) {
            console.log('Test partner already exists');
            return;
        }

        // Create test food partner
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const testPartner = new FoodPartner({
            fullName: 'Delicious Bites Restaurant',
            email: 'testpartner@example.com',
            password: hashedPassword,
            contactName: 'John Chef',
            phone: '+1234567890',
            address: '123 Food Street, Tasty City, TC 12345',
            profileImg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'
        });

        await testPartner.save();
        console.log('Test food partner created successfully!');

        // Create test food items
        const foodItems = [
            {
                name: 'Delicious Burger',
                description: 'A mouth-watering burger with fresh ingredients',
                video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                price: 12.99,
                foodPartner: testPartner._id
            },
            {
                name: 'Crispy Pizza',
                description: 'Wood-fired pizza with authentic Italian flavors',
                video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                price: 18.50,
                foodPartner: testPartner._id
            },
            {
                name: 'Fresh Salad',
                description: 'Healthy and fresh garden salad with organic vegetables',
                video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
                price: 9.99,
                foodPartner: testPartner._id
            }
        ];

        await Food.insertMany(foodItems);
        console.log('Test food items created successfully!');

        console.log('\n=== Test Data Created ===');
        console.log('Food Partner:');
        console.log('Email: testpartner@example.com');
        console.log('Password: password123');
        console.log('Partner ID:', testPartner._id);
        console.log('\nUser (from previous script):');
        console.log('Email: test@example.com');
        console.log('Password: password123');

    } catch (error) {
        console.error('Error creating test data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createTestData();