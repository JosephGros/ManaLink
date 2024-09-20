const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here';

async function testConnection() {
  try {
    console.log('Trying to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

testConnection();
