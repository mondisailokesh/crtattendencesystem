export class AttendanceManager {
    constructor() {
        this.apiUrl = '/api/attendance';
        this.students = [];
    }

    async loadStudents(year, section, date) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiUrl}/students?year=${year}&section=${section}&date=${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.students = data.students;
                this.renderStudentsList(data.students, data.existingAttendance);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error loading students:', error);
            throw error;
        }
    }

    renderStudentsList(students, existingAttendance = {}) {
        const container = document.getElementById('studentsList');
        
        if (students.length === 0) {
            container.innerHTML = '<div class="loading">No students found for the selected criteria.</div>';
            return;
        }

        let html = `
            <div class="students-header">
                <div>Register Number</div>
                <div>Student Name</div>
                <div>Attendance</div>
            </div>
        `;

        students.forEach(student => {
            const isPresent = existingAttendance[student.registerNumber] === 'present';
            const isAbsent = existingAttendance[student.registerNumber] === 'absent';
            
            html += `
                <div class="student-row">
                    <div class="register-number">${student.registerNumber}</div>
                    <div class="student-name">${student.name}</div>
                    <div class="attendance-options">
                        <div class="radio-group">
                            <input type="radio" id="present_${student.registerNumber}" 
                                   name="attendance_${student.registerNumber}" 
                                   value="present" ${isPresent ? 'checked' : ''}>
                            <label for="present_${student.registerNumber}">Present</label>
                        </div>
                        <div class="radio-group">
                            <input type="radio" id="absent_${student.registerNumber}" 
                                   name="attendance_${student.registerNumber}" 
                                   value="absent" ${isAbsent ? 'checked' : ''}>
                            <label for="absent_${student.registerNumber}">Absent</label>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    markAll(status) {
        this.students.forEach(student => {
            const radio = document.getElementById(`${status}_${student.registerNumber}`);
            if (radio) {
                radio.checked = true;
            }
        });
    }

    async submitAttendance(date, year, section) {
        const attendanceData = [];
        
        this.students.forEach(student => {
            const presentRadio = document.getElementById(`present_${student.registerNumber}`);
            const absentRadio = document.getElementById(`absent_${student.registerNumber}`);
            
            let status = null;
            if (presentRadio && presentRadio.checked) {
                status = 'present';
            } else if (absentRadio && absentRadio.checked) {
                status = 'absent';
            }
            
            if (status) {
                attendanceData.push({
                    registerNumber: student.registerNumber,
                    studentName: student.name,
                    status: status
                });
            }
        });

        if (attendanceData.length === 0) {
            return {
                success: false,
                message: 'Please mark attendance for at least one student'
            };
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${this.apiUrl}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date,
                    year,
                    section,
                    attendance: attendanceData
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error submitting attendance:', error);
            return {
                success: false,
                message: 'Failed to submit attendance'
            };
        }
    }
}