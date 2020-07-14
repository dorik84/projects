const mongoose = require('mongoose');
const keys = require('./keys');


const dbOptions = {useNewUrlParser: true, useUnifiedTopology: true};
const connection = mongoose.createConnection(keys.mongodb.dbURI, dbOptions)


module.exports = connection;