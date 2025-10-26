'use strict';

const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, dbName ? { dbName } : undefined);
    console.log(`MongoDB connected${dbName ? ` (db: ${dbName})` : ''}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB');
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;
