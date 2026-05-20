import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('URI:', uri);
mongoose.connect(uri)
  .then(() => console.log('Success'))
  .catch(err => console.error('Error:', err.message))
  .finally(() => process.exit(0));
