const connectMongo = require('connect-mongo');
console.log('Type:', typeof connectMongo);
console.log('Keys:', Object.keys(connectMongo));
console.log('Export:', connectMongo);
try {
    console.log('Default:', connectMongo.default);
} catch (e) { }
