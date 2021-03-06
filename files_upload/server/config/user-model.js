const mongoose = require('mongoose');
const connection = require('./database');

const UserSchema = new mongoose.Schema({
    email: String,
    hash: String,
    salt: String,
    images: [Object]
    // images: Array
});

const User = connection.model('User', UserSchema);


module.exports = User;
