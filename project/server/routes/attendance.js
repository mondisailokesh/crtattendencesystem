import express from 'express';
import { body, validationResult } from 'express-validator';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get students for attendance
router.get('/students', authenticateToken, async (req, res) => {
    try {
        const { year, section, date } = req.query;

        if (!year || !section || !date) {
            return res.status(400).json({
                success: false,
                message: 'Year, section, and date are required'
            });
        }

        // Get students
        const students = await Student.find({
            year: parseInt(year),
            section: section,
            isActive: true
        }).sort({ registerNumber: 1 });

        // Get existing attendance for the date
        const existingAttendance = await Attendance.find({
            date: new Date(date),
            year: parseInt(year),
            section: section
        });

        // Create a map of existing attendance
        const attendanceMap = {};
        existingAttendance.forEach(record => {
            attendanceMap[record.registerNumber] = record.status;
        });

        res.json({
            success: true,
            students,
            existingAttendance: attendanceMap
        });

    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Submit attendance
router.post('/submit', [
    authenticateToken,
    body('date').isISO8601().withMessage('Valid date is required'),
    body('year').isInt({ min: 2, max: 4 }).withMessage('Year must be 2, 3, or 4'),
    body('section').isIn(['A', 'B']).withMessage('Section must be A or B'),
    body('attendance').isArray({ min: 1 }).withMessage('Attendance data is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input data',
                errors: errors.array()
            });
        }

        const { date, year, section, attendance } = req.body;
        const facultyId = req.user.id;

        // Delete existing attendance for the date, year, and section
        await Attendance.deleteMany({
            date: new Date(date),
            year: parseInt(year),
            section: section
        });

        // Prepare attendance records
        const attendanceRecords = attendance.map(record => ({
            date: new Date(date),
            year: parseInt(year),
            section: section,
            registerNumber: record.registerNumber,
            studentName: record.studentName,
            status: record.status,
            markedBy: facultyId
        }));

        // Insert new attendance records
        await Attendance.insertMany(attendanceRecords);

        res.json({
            success: true,
            message: 'Attendance submitted successfully',
            recordsCount: attendanceRecords.length
        });

    } catch (error) {
        console.error('Error submitting attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;