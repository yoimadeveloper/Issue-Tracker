const mongoose = require("mongoose");

const db = mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});
console.log(mongoose.connection.readyState);


module.exports = db;