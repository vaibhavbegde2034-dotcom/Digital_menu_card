const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log('Attempting to connect to MongoDB...');
        // Log a masked version of the URI for debugging
        if (uri) {
            const maskedUri = uri.replace(/\/\/.*@/, '//****:****@');
            console.log('URI:', maskedUri);
        } else {
            console.log('URI is UNDEFINED');
        }
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
