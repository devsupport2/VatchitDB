const Schedule = require('../models/schedule-model');


createSchedule = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Schedule',
        })
    }

    const schedule = new Schedule(body)

    if (!schedule) {
        return res.status(400).json({ success: false, error: err })
    }

    schedule
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                schedule_id: schedule._id,
                message: 'Schedule created and Message Copied to clipboard!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'schedule not created!',
            })
        })
	
}

updateSchedule = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Schedule.findOne({ _id: req.params.id }, (err, schedule) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Schedule not found!',
            })
        }

        schedule.user_id = body.user_id
        schedule.meeting_title = body.meeting_title
        schedule.meeting_dateandtime = body.meeting_dateandtime
        schedule.meeting_pass = body.meeting_pass
        schedule
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    schedule_id: schedule._id,
                    message: 'Schedule updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Schedule not updated!',
                })
            })
    })
}

deleteSchedule = async (req, res) => {
    await Schedule.findOneAndDelete({ _id: req.params.id }, (err, schedule) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!schedule) {
            return res
                .status(404)
                .json({ success: false, error: `Schedule not found` })
        }

        return res.status(200).json({ success: true, data: schedule })
    }).catch(err => console.log(err))
}

getScheduleById = async (req, res) => {
    await Schedule.findOne({ _id: req.params.id }, (err, schedule) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!schedule) {
            return res
                .status(404)
                .json({ success: false, error: `Schedule not found` })
        }
        return res.status(200).json({ success: true, data: schedule })
    }).catch(err => console.log(err))
}

getSchedules = async (req, res) => {
    await Schedule.find({}, (err, schedules) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!schedules.length) {
            return res
                .status(404)
                .json({ success: false, error: `Schedule not found` })
        }
        return res.status(200).json({ success: true, data: schedules })
    }).catch(err => console.log(err))
}

getSchedulesWithUserId = async (req, res) => {
    await Schedule.find({ user_id: req.body.user_id }, (err, schedule) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!schedule) {
            return res
                .status(404)
                .json({ success: false, error: `Schedule not found` })
        }
        return res.status(200).json({ success: true, data: schedule })
    }).catch(err => console.log(err))
}


module.exports = {
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedules,
    getScheduleById,
    getSchedulesWithUserId,
}
