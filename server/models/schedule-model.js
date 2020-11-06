const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Schedule = new Schema(
    {
        user_id: { type: String, required: true },
        meeting_title: { type: String, required: true },
        meeting_dateandtime: { type: Date, required: true },
        meeting_pass: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('schedules', Schedule)