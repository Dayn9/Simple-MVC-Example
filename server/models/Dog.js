const mongoose = require('mongoose');

let DogModel = {};
const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
  },
  age: {
    type: Number,
  },
  createdDate: {
    type: Number,
  },
});

DogSchema.statics.findByName = (name, callback) => {
  const search = { name };
  return DogModel.findOne(search, callback);
};

DogModel = mongoose.model('Dog', DogSchema);

module.exports = {
  DogModel,
  DogSchema,
};
