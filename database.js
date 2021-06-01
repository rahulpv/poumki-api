const mongoose = require('mongoose');
var staticData = require('./constants/staticData');



function connect() {
    return new Promise((resolve, reject) => {

            mongoose.connect(staticData.databseUrl,
                { useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true })
                .then((res, err) => {
                    if (err) return reject(err);
                    resolve();
                })
    });
}

function close() {
    return mongoose.disconnect();
}

module.exports = { connect, close };