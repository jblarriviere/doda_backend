var mongoose = require('mongoose');
var uid2 = require('uid2');
var bcrypt = require('bcrypt')

var TripSchema = mongoose.Schema({
    budget: Number,
    date: Date,
    activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'activities'}]
})

var usersSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    birthday: Date,
    nationality: String,
    interests: [String],
    trips: [TripSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'activities' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'activities' }]
});

var usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;