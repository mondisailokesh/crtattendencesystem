import bcrypt from 'bcryptjs';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import mongoose from 'mongoose';

export const seedDatabase = async () => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected. Skipping database seeding.');
            return;
        }

        // Check if faculty already exists
        const facultyCount = await Faculty.countDocuments();
        if (facultyCount === 0) {
            console.log('Seeding faculty data...');
            await seedFaculty();
        }

        // Check if students already exist
        const studentCount = await Student.countDocuments();
        if (studentCount === 0) {
            console.log('Seeding student data...');
            await seedStudents();
        }

        console.log('Database seeding completed');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

export const reseedDatabase = async () => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected. Cannot reseed database.');
            return;
        }

        console.log('Clearing existing data...');
        
        // Clear existing data
        await Faculty.deleteMany({});
        await Student.deleteMany({});
        
        console.log('Existing data cleared. Reseeding database...');
        
        // Reseed with new data
        await seedFaculty();
        await seedStudents();
        
        console.log('Database reseeding completed successfully!');
    } catch (error) {
        console.error('Error reseeding database:', error);
    }
};

const seedFaculty = async () => {
    const facultyData = [
        {
            name: 'Dr. D. G. Krishna Mohan',
            email: 'krishnamohan',
            username: 'krishnamohan',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML',
            role: 'admin'
        },
        {
            name: 'Dr. M. Ratnababu',
            email: 'ratnababu@vit.edu',
            username: 'ratnababu',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML',
            role: 'faculty'
        },
        {
            name: 'Mr. P. L. N. Prakash Kumar',
            email: 'prakashkumar@vit.edu',
            username: 'prakashkumar',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML',
            role: 'admin'
        },
        {
            name: 'Mrs. S. Annapurna',
            email: 'annapurna@vit.edu',
            username: 'annapurna',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML'
        },
        {
            name: 'Mrs. D. Sushma',
            email: 'sushma@vit.edu',
            username: 'sushma',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML'
        },
        {
            name: 'Mr. K. Sravana Kumar',
            email: 'sravanakumar@vit.edu',
            username: 'sravanakumar',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML'
        },
        {
            name: 'Mrs. S. Ramya',
            email: 'ramya@vit.edu',
            username: 'ramya',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML'
        },
        {
            name: 'Mr. K Sai Kumar',
            email: 'saikumar@vit.edu',
            username: 'saikumar',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML'
        },
        {
            name: 'Faculty9',
            email: 'Faculty9@vit.edu',
            username: 'Faculty9',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML'
        },
        {
            name: 'Faculty10',
            email: 'Faculty10@vit.edu',
            username: 'Faculty',
            password: await bcrypt.hash('password123', 10),
            department: 'AIML'
        }
    ];

    await Faculty.insertMany(facultyData);
    console.log('Faculty data seeded successfully');
};

const seedStudents = async () => {
    const students = [];
    
    // Generate students for each year and section
    const years = [2, 3, 4];
    const sections = ['A', 'B'];
    
    const firstNames = [
        'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
        'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Rishabh', 'Aryan', 'Kabir', 'Ansh', 'Kian', 'Rudra',
        'Aadhya', 'Ananya', 'Diya', 'Ira', 'Pihu', 'Prisha', 'Anvi', 'Riya', 'Navya', 'Kavya',
        'Aanya', 'Sara', 'Myra', 'Anika', 'Zara', 'Kiara', 'Saanvi', 'Arya', 'Avni', 'Pari'
    ];
    
    const lastNames = [
        'Sharma', 'Patel', 'Singh', 'Kumar', 'Reddy', 'Gupta', 'Agarwal', 'Jain', 'Bansal', 'Mehta',
        'Shah', 'Verma', 'Agrawal', 'Goyal', 'Mittal', 'Joshi', 'Chopra', 'Malhotra', 'Arora', 'Kapoor',
        'Nair', 'Iyer', 'Menon', 'Pillai', 'Krishnan', 'Raman', 'Sundaram', 'Venkatesh', 'Srinivasan', 'Bhat'
    ];

    let studentCounter = 1;

    for (const year of years) {
        for (const section of sections) {
            // 75 students per year-section combination (150 per year, 450 total)
            for (let i = 0; i < 75; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                
                students.push({
                    registerNumber: `21A91A05${String(studentCounter).padStart(2, '0')}`,
                    name: `${firstName} ${lastName}`,
                    year: year,
                    section: section,
                    department: 'AIML'
                });
                
                studentCounter++;
            }
        }
    }

    await Student.insertMany(students);
    console.log(`${students.length} students seeded successfully`);
};