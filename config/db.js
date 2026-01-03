const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log('Attempting to connect to MongoDB at:', uri);
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return uri;
    } catch (error) {
        console.warn(`Local MongoDB connection failed: ${error.message}`);
        console.log('Falling back to mongodb-memory-server...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            const conn = await mongoose.connect(uri);
            console.log(`Embedded MongoDB Connected: ${conn.connection.host}`);
            return uri;
        } catch (innerError) {
            console.error(`Embedded DB failed: ${innerError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
