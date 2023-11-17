const mongoose = require('mongoose');
const { MONGO_URI } = require('../constants/environment');

// Set up default mongoose connection
mongoose.Promise = global.Promise;

mongoose.connection.on('open', () => {
    console.log('MongoDB: Connected');
});

mongoose.connection.on('error', (err) => {
    console.log('MongoDB: Error', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB: Disconnected');
});

// Connect to MongoDB Atlas database using Mongoose ODM
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB Atlas!');
    } catch (error) {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    }
}

module.exports = connectDB;
