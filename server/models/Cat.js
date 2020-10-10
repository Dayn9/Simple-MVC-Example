const mongoose = require('mongoose');

let CatModel = {};
const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  bedsOwned: {
    type: Number,
    min: 0,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

CatSchema.statics.findByName = (name, callback) => {
  const search = { name };
  return CatModel.findOne(search, callback);
};

CatModel = mongoose.model('Cat', CatSchema);

module.exports = {
  CatModel,
  CatSchema,
};
