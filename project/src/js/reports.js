import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class ReportsManager {
    constructor() {
        this.apiUrl = '/api/reports';
        this.currentReportData = null;
    }

    updateFilters(reportType) {
        const filtersContainer = document.getElementById('reportFilters');
        let filtersHTML = '';

        switch (reportType) {
            case 'daily':
                filtersHTML = `
                    <div class="form-group">
                        <label for="reportDate">Date</label>
                        <input type="date" id="reportDate" required>
                    </div>
                    <div class="form-group">
                        <label for="reportYear">Year</label>
                        <select id="reportYear">
                            <option value="">All Years</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reportSection">Section</label>
                        <select id="reportSection">
                            <option value="">All Sections</option>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                        </select>
                    </div>
                `;
                break;
            case 'monthly':
                filtersHTML = `
                    <div class="form-group">
                        <label for="reportMonth">Month</label>
                        <select id="reportMonth" required>
                            <option value="">Select Month</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reportMonthYear">Year</label>
                        <select id="reportMonthYear" required>
                            <option value="">Select Year</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reportYear">Class Year</label>
                        <select id="reportYear">
                            <option value="">All Years</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reportSection">Section</label>
                        <select id="reportSection">
                            <option value="">All Sections</option>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                        </select>
                    </div>
                `;
                break;
            case 'yearly':
                filtersHTML = `
                    <div class="form-group">
                        <label for="reportAcademicYear">Academic Year</label>
                        <select id="reportAcademicYear" required>
                            <option value="">Select Year</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reportYear">Class Year</label>
                        <select id="reportYear">
                            <option value="">All Years</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="reportSection">Section</label>
                        <select id="reportSection">
                            <option value="">All Sections</option>
                            <option value="A">Section A</option>
                            <option value="B">Section B</option>
                        </select>
                    </div>
                `;
                break;
            case 'student':
                filtersHTML = `
                    <div class="form-group">
                        <label for="studentRegisterNumber">Register Number</label>
                        <input type="text" id="studentRegisterNumber" placeholder="Enter register number" required>
                    </div>
                    <div class="form-group">
                        <label for="reportFromDate">From Date</label>
                        <input type="date" id="reportFromDate">
                    </div>
                    <div class="form-group">
                        <label for="reportToDate">To Date</label>
                        <input type="date" id="reportToDate">
                    </div>
                `;
                break;
        }

        filtersContainer.innerHTML = filtersHTML;

        // Set default date to today for daily reports
        if (reportType === 'daily') {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('reportDate').value = today;
        }
    }

    async generateReport(reportType) {
        const filters = this.getFilters(reportType);
        
        if (!this.validateFilters(reportType, filters)) {
            throw new Error('Please fill in all required fields');
        }

        try {
            const token = localStorage.getItem('authToken');
            const queryParams = new URLSearchParams(filters).toString();
            
            const response = await fetch(`${this.apiUrl}/${reportType}?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                this.currentReportData = data;
                this.renderReport(data, reportType);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error generating report:', error);
            throw error;
        }
    }

    getFilters(reportType) {
        const filters = {};

        switch (reportType) {
            case 'daily':
                filters.date = document.getElementById('reportDate')?.value || '';
                filters.year = document.getElementById('reportYear')?.value || '';
                filters.section = document.getElementById('reportSection')?.value || '';
                break;
            case 'monthly':
                filters.month = document.getElementById('reportMonth')?.value || '';
                filters.year = document.getElementById('reportMonthYear')?.value || '';
                filters.classYear = document.getElementById('reportYear')?.value || '';
                filters.section = document.getElementById('reportSection')?.value || '';
                break;
            case 'yearly':
                filters.academicYear = document.getElementById('reportAcademicYear')?.value || '';
                filters.classYear = document.getElementById('reportYear')?.value || '';
                filters.section = document.getElementById('reportSection')?.value || '';
                break;
            case 'student':
                filters.registerNumber = document.getElementById('studentRegisterNumber')?.value || '';
                filters.fromDate = document.getElementById('reportFromDate')?.value || '';
                filters.toDate = document.getElementById('reportToDate')?.value || '';
                break;
        }

        return filters;
    }

    validateFilters(reportType, filters) {
        switch (reportType) {
            case 'daily':
                return filters.date;
            case 'monthly':
                return filters.month && filters.year;
            case 'yearly':
                return filters.academicYear;
            case 'student':
                return filters.registerNumber;
            default:
                return false;
        }
    }

    renderReport(data, reportType) {
        const container = document.getElementById('reportResults');
        
        let html = `
            <div class="report-summary">
                <div class="summary-item">
                    <span class="summary-value">${data.summary.totalStudents}</span>
                    <span class="summary-label">Total Students</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${data.summary.presentCount}</span>
                    <span class="summary-label">Present</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${data.summary.absentCount}</span>
                    <span class="summary-label">Absent</span>
                </div>
                <div class="summary-item">
                    <span class="summary-value">${data.summary.attendancePercentage}%</span>
                    <span class="summary-label">Attendance %</span>
                </div>
            </div>
        `;

        if (data.records && data.records.length > 0) {
            html += '<table class="report-table">';
            
            // Table headers
            if (reportType === 'student') {
                html += `
                    <thead>
                        <tr>
                            <th onclick="sortTable(0)">Date</th>
                            <th onclick="sortTable(1)">Status</th>
                            <th onclick="sortTable(2)">Year</th>
                            <th onclick="sortTable(3)">Section</th>
                        </tr>
                    </thead>
                `;
            } else {
                html += `
                    <thead>
                        <tr>
                            <th onclick="sortTable(0)">Register Number</th>
                            <th onclick="sortTable(1)">Student Name</th>
                            <th onclick="sortTable(2)">Status</th>
                            ${reportType !== 'daily' ? '<th onclick="sortTable(3)">Date</th>' : ''}
                        </tr>
                    </thead>
                `;
            }

            html += '<tbody>';
            
            data.records.forEach(record => {
                if (reportType === 'student') {
                    html += `
                        <tr>
                            <td>${new Date(record.date).toLocaleDateString()}</td>
                            <td><span class="status-badge ${record.status}">${record.status}</span></td>
                            <td>${record.year}</td>
                            <td>${record.section}</td>
                        </tr>
                    `;
                } else {
                    html += `
                        <tr>
                            <td>${record.registerNumber}</td>
                            <td>${record.studentName}</td>
                            <td><span class="status-badge ${record.status}">${record.status}</span></td>
                            ${reportType !== 'daily' ? `<td>${new Date(record.date).toLocaleDateString()}</td>` : ''}
                        </tr>
                    `;
                }
            });
            
            html += '</tbody></table>';
        } else {
            html += '<div class="loading">No attendance records found for the selected criteria.</div>';
        }

        container.innerHTML = html;

        // Add CSS for status badges
        if (!document.getElementById('statusBadgeStyles')) {
            const style = document.createElement('style');
            style.id = 'statusBadgeStyles';
            style.textContent = `
                .status-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: uppercase;
                }
                .status-badge.present {
                    background-color: #d1fae5;
                    color: #065f46;
                }
                .status-badge.absent {
                    background-color: #fee2e2;
                    color: #991b1b;
                }
            `;
            document.head.appendChild(style);
        }
    }

    exportToPDF() {
        if (!this.currentReportData) {
            alert('No report data to export');
            return;
        }

        const doc = new jsPDF();
        const data = this.currentReportData;
        
        // Add title
        doc.setFontSize(16);
        doc.text('CRT Attendance Report - AIML Department', 20, 20);
        doc.text('Vishnu Institute of Technology', 20, 30);
        
        // Add summary
        doc.setFontSize(12);
        doc.text(`Total Students: ${data.summary.totalStudents}`, 20, 50);
        doc.text(`Present: ${data.summary.presentCount}`, 20, 60);
        doc.text(`Absent: ${data.summary.absentCount}`, 20, 70);
        doc.text(`Attendance Percentage: ${data.summary.attendancePercentage}%`, 20, 80);
        
        // Add table
        if (data.records && data.records.length > 0) {
            const tableData = data.records.map(record => [
                record.registerNumber || new Date(record.date).toLocaleDateString(),
                record.studentName || record.status,
                record.status || record.year,
                record.date ? new Date(record.date).toLocaleDateString() : record.section
            ]);

            doc.autoTable({
                head: [['Register Number', 'Student Name', 'Status', 'Date']],
                body: tableData,
                startY: 90,
                styles: {
                    fontSize: 10,
                    cellPadding: 3
                },
                headStyles: {
                    fillColor: [59, 130, 246],
                    textColor: 255
                }
            });
        }
        
        // Save the PDF
        const fileName = `attendance_report_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    }
}

// Global function for table sorting
window.sortTable = function(columnIndex) {
    const table = document.querySelector('.report-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const isAscending = table.getAttribute('data-sort-direction') !== 'asc';
    table.setAttribute('data-sort-direction', isAscending ? 'asc' : 'desc');
    
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        if (isAscending) {
            return aText.localeCompare(bText);
        } else {
            return bText.localeCompare(aText);
        }
    });
    
    rows.forEach(row => tbody.appendChild(row));
};