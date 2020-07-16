const mongoose = require('mongoose');
const keys = require('./keys');


const dbOptions = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};
const connection = mongoose.createConnection(keys.mongodb.dbURI, dbOptions)


module.exports = connection;