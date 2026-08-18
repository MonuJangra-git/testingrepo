#!/bin/sh
set -e

echo "Waiting for MongoDB to be ready..."

node -e "
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

function wait() {
  mongoose.connect(uri)
    .then(() => {
      console.log('MongoDB is ready.');
      process.exit(0);
    })
    .catch(() => {
      console.log('MongoDB not ready yet, retrying...');
      setTimeout(wait, 2000);
    });
}

wait();
"

echo "Checking if products need seeding..."

node -e "
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    console.log('No products found. Seeding database...');
    process.exit(1); // signal that seeding is needed
  } else {
    console.log('Products already exist (' + count + '). Skipping seed.');
    process.exit(0);
  }
}).catch((err) => {
  console.error(err);
  process.exit(0);
});
" || npm run seed

echo "Starting the app..."
exec "$@"
