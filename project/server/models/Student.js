import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    registerNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
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
    department: {
        type: String,
        default: 'AIML',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
studentSchema.index({ year: 1, section: 1 });

export default mongoose.model('Student', studentSchema);