const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      family: 4,
    });

    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Pinged MongoDB successfully!');
    await client.close();

    // Now connect mongoose for the app
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;