require('dotenv').config();
const connectDB = require('./db');
const Customer = require('../models/Customer');
const Revenue = require('../models/Revenue');
const ActivityLog = require('../models/ActivityLog');

async function createIndexes() {
  await connectDB();
  
  try {
    await Customer.collection.createIndex({ status: 1 }, { background: true });
    console.log('Created status index');
  } catch (e) { console.log('status index already exists'); }

  try {
    await Customer.collection.createIndex({ createdAt: -1 }, { background: true });
    console.log('Created createdAt index');
  } catch (e) { console.log('createdAt index already exists'); }

  try {
    await Revenue.collection.createIndex({ month: 1 }, { background: true });
    console.log('Created month index');
  } catch (e) { console.log('month index already exists'); }

  try {
    await ActivityLog.collection.createIndex({ createdAt: -1 }, { background: true });
    console.log('Created activitylog index');
  } catch (e) { console.log('activitylog index already exists'); }

  console.log('Done!');
  process.exit(0);
}

createIndexes().catch(console.error);