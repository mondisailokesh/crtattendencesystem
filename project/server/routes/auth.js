import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Faculty from '../models/Faculty.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login route
router.post('/login', [
    body('email').notEmpty().withMessage('Email/Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

        const { email, password } = req.body;

        // Find faculty by email or username
        const faculty = await Faculty.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: email }
            ],
            isActive: true
        });

        if (!faculty) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, faculty.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        faculty.lastLogin = new Date();
        await faculty.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                user: {
                    id: faculty._id,
                    name: faculty.name,
                    email: faculty.email,
                    department: faculty.department,
                    role: faculty.role
                }
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                department: faculty.department,
                role: faculty.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Verify token route
router.get('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const faculty = await Faculty.findById(decoded.user.id).select('-password');
        
        if (!faculty || !faculty.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        res.json({
            success: true,
            user: {
                id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                department: faculty.department,
                role: faculty.role
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

// Change password route
router.post('/change-password', [
    body('oldPassword').isLength({ min: 6 }).withMessage('Old password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const faculty = await Faculty.findById(decoded.user.id);
        if (!faculty || !faculty.isActive) {
            return res.status(401).json({ success: false, message: 'Invalid user' });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Invalid input data', errors: errors.array() });
        }
        const { oldPassword, newPassword } = req.body;
        const isPasswordValid = await bcrypt.compare(oldPassword, faculty.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Old password is incorrect' });
        }
        faculty.password = await bcrypt.hash(newPassword, 10);
        await faculty.save();
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Signup route (admin only)
router.post('/signup', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const adminUser = await Faculty.findById(decoded.user.id);
        if (!adminUser || !adminUser.isActive || adminUser.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const { name, email, username, password, department } = req.body;
        if (!name || !email || !username || !password || !department) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const existing = await Faculty.findOne({ $or: [ { email: email.toLowerCase() }, { username } ] });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email or username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newFaculty = new Faculty({
            name,
            email: email.toLowerCase(),
            username,
            password: hashedPassword,
            department,
            role: 'faculty'
        });
        await newFaculty.save();
        res.json({ success: true, message: 'Faculty user created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Remove user route (admin only)
router.post('/remove-user', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        const adminUser = await Faculty.findById(decoded.user.id);
        if (!adminUser || !adminUser.isActive || adminUser.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ success: false, message: 'Username is required' });
        }
        if (username === adminUser.username) {
            return res.status(400).json({ success: false, message: 'You cannot remove yourself' });
        }
        const userToRemove = await Faculty.findOne({ username });
        if (!userToRemove) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Soft delete: set isActive to false
        userToRemove.isActive = false;
        await userToRemove.save();
        res.json({ success: true, message: 'User removed successfully' });
    } catch (error) {
        console.error('Remove user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;