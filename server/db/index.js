const mongoose = require('mongoose')

mongoose
    .connect('mongodb://173.45.79.26:27018/vatchit', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db
