import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    year: {
        type: Number,
        required: true,
        enum: [2, 3, 4]
    },
    section: {
        type: String,
        required: true,
        enum: ['A', 'B']
    },
    registerNumber: {
        type: String,
        required: true,
        trim: true
    },
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['present', 'absent']
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    }
}, {
    timestamps: true
});

// Compound indexes for efficient queries
attendanceSchema.index({ date: 1, year: 1, section: 1 });
attendanceSchema.index({ registerNumber: 1, date: 1 });
attendanceSchema.index({ date: 1 });

// Ensure unique attendance record per student per date
attendanceSchema.index({ date: 1, registerNumber: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);