import express from 'express';
import { query, validationResult } from 'express-validator';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Daily report
router.get('/daily', [
    authenticateToken,
    query('date').isISO8601().withMessage('Valid date is required')
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

        const { date, year, section } = req.query;
        const queryDate = new Date(date);

        // Build query
        const query = { date: queryDate };
        if (year) query.year = parseInt(year);
        if (section) query.section = section;

        // Get attendance records
        const records = await Attendance.find(query).sort({ registerNumber: 1 });

        // Calculate summary
        const totalStudents = records.length;
        const presentCount = records.filter(r => r.status === 'present').length;
        const absentCount = records.filter(r => r.status === 'absent').length;
        const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

        res.json({
            success: true,
            records,
            summary: {
                totalStudents,
                presentCount,
                absentCount,
                attendancePercentage
            }
        });

    } catch (error) {
        console.error('Error generating daily report:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Monthly report
router.get('/monthly', [
    authenticateToken,
    query('month').isInt({ min: 1, max: 12 }).withMessage('Valid month is required'),
    query('year').isInt({ min: 2020, max: 2030 }).withMessage('Valid year is required')
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

        const { month, year, classYear, section } = req.query;

        // Create date range for the month
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);

        // Build query
        const query = {
            date: { $gte: startDate, $lte: endDate }
        };
        if (classYear) query.year = parseInt(classYear);
        if (section) query.section = section;

        // Get attendance records
        const records = await Attendance.find(query).sort({ date: -1, registerNumber: 1 });

        // Calculate summary
        const totalStudents = records.length;
        const presentCount = records.filter(r => r.status === 'present').length;
        const absentCount = records.filter(r => r.status === 'absent').length;
        const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

        res.json({
            success: true,
            records,
            summary: {
                totalStudents,
                presentCount,
                absentCount,
                attendancePercentage
            }
        });

    } catch (error) {
        console.error('Error generating monthly report:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Yearly report
router.get('/yearly', [
    authenticateToken,
    query('academicYear').isInt({ min: 2020, max: 2030 }).withMessage('Valid academic year is required')
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

        const { academicYear, classYear, section } = req.query;

        // Create date range for the academic year
        const startDate = new Date(parseInt(academicYear), 0, 1);
        const endDate = new Date(parseInt(academicYear), 11, 31);

        // Build query
        const query = {
            date: { $gte: startDate, $lte: endDate }
        };
        if (classYear) query.year = parseInt(classYear);
        if (section) query.section = section;

        // Get attendance records
        const records = await Attendance.find(query).sort({ date: -1, registerNumber: 1 });

        // Calculate summary
        const totalStudents = records.length;
        const presentCount = records.filter(r => r.status === 'present').length;
        const absentCount = records.filter(r => r.status === 'absent').length;
        const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

        res.json({
            success: true,
            records,
            summary: {
                totalStudents,
                presentCount,
                absentCount,
                attendancePercentage
            }
        });

    } catch (error) {
        console.error('Error generating yearly report:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Individual student report
router.get('/student', [
    authenticateToken,
    query('registerNumber').notEmpty().withMessage('Register number is required')
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

        const { registerNumber, fromDate, toDate } = req.query;

        // Build query
        const query = { registerNumber };
        if (fromDate && toDate) {
            query.date = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }

        // Get attendance records
        const records = await Attendance.find(query).sort({ date: -1 });

        // Calculate summary
        const totalStudents = records.length;
        const presentCount = records.filter(r => r.status === 'present').length;
        const absentCount = records.filter(r => r.status === 'absent').length;
        const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

        res.json({
            success: true,
            records,
            summary: {
                totalStudents,
                presentCount,
                absentCount,
                attendancePercentage
            }
        });

    } catch (error) {
        console.error('Error generating student report:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;