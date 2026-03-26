const mongoose = require('mongoose');

async function checkDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chain10challenge');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`${col.name}: ${count} documents`);
    }

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkDB();