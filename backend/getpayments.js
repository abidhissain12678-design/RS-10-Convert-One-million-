const mongoose = require('mongoose');

async function getPayments() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chain10challenge');
    const payments = await mongoose.model('Payment', {}).find({});
    console.log('All Payments:', JSON.stringify(payments, null, 2));
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

getPayments();