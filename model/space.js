const mongoose = require('mongoose');

const schema = mongoose.Schema({
    copyright: String,
    date: Date,
    explanation: String,
    hdurl: String,
    media_type: String,
    service_version: String,
    title: String,
    url:String
});

const daily_space = mongoose.model('space', schema);
module.exports = daily_space;