const mongoose = require('mongoose');

async function getUsers() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chain10challenge');
    const users = await mongoose.model('User', {}).find({});
    console.log('Users:', users);
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

getUsers();