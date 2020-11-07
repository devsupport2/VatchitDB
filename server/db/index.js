const mongoose = require('mongoose')

mongoose
    //.connect('mongodb://173.45.79.26:27018/vatchit', { useNewUrlParser: true }) //LiveServer
    .connect('mongodb://localhost:27017/vatchit', { useNewUrlParser: true }) //LocalServer
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db
