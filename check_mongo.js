const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/devnews';

const connect = async () => {
    try {
        console.log('Connecting to', uri);
        await mongoose.connect(uri);
        console.log('Connected successfully');
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
};

connect();
