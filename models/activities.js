const mongoose = require('mongoose');

const businessHoursSchema = mongoose.Schema({
  day: Number,
  periods: Array
});

const activitySchema = mongoose.Schema({
  title: String,
  description: String,
  imgUrl: String,
  firstDay: Date,
  lastDay: Date,
  openingHours: [businessHoursSchema],
  address: String,
  latitude: Number,
  longitude: Number,
  telephone: String,
  website: String,
  pricing: Number,
  category: String,
  rating: Number,
  nbRating: Number
});

module.exports = mongoose.model('activities', activitySchema);