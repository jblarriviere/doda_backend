const mongoose = require('mongoose');
const faker = require('faker');

faker.locale = "fr";

const PeriodSchema = mongoose.Schema({
  close: Object,
  open: Object
});

const activitySchema = mongoose.Schema({
  title: String,
  description: String,
  imgUrl: String,
  firstDay: {
    type: Date,
    default: () => new Date('1970'),
  },
  lastDay: {
    type: Date,
    default: () => new Date('2050'),
  },
  openingHours: {
    type: [PeriodSchema],
    default: () => [{
      open: {
        day: 0,
        time: "0000"
      }
    }]
  },
  address: String,
  latitude: Number,
  longitude: Number,
  telephone: {
    type: String,
    default: () => `+33(0)1.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}`
  },
  website: String,
  pricing: Number,
  category: String,
  rating: {
    type: Number,
    default: () => Math.floor(Math.random() * 6)
  },
  nbRating: {
    type: Number,
    default: () => Math.floor(Math.random() * 151)
  },
  loc: Object,
  googleId: String
});

module.exports = mongoose.model('activities', activitySchema);