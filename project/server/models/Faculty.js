import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        default: 'AIML',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    role: {
        type: String,
        enum: ['admin', 'faculty'],
        default: 'faculty',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Faculty', facultySchema);