import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String, 
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const Store = mongoose.model('Store', storeSchema);
export default Store;
