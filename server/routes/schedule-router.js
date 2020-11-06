const express = require('express')

const ScheduleCtrl = require('../controllers/schedule-ctrl')

const router = express.Router()

router.post('/create', ScheduleCtrl.createSchedule)
router.put('/update/:id', ScheduleCtrl.updateSchedule)
router.delete('/delete/:id', ScheduleCtrl.deleteSchedule)
router.get('/getById/:id', ScheduleCtrl.getScheduleById)
router.get('/getAll', ScheduleCtrl.getSchedules)
router.post('/getByUserId',ScheduleCtrl.getSchedulesWithUserId)

module.exports = router
