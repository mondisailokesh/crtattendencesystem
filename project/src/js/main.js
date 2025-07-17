import { AuthManager } from './auth.js';
import { AttendanceManager } from './attendance.js';
import { ReportsManager } from './reports.js';
import { UIManager } from './ui.js';

class App {
    constructor() {
        this.auth = new AuthManager();
        this.attendance = new AttendanceManager();
        this.reports = new ReportsManager();
        this.ui = new UIManager();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Attendance controls
        document.getElementById('loadStudents').addEventListener('click', () => {
            this.loadStudents();
        });

        document.getElementById('markAllPresent').addEventListener('click', () => {
            this.attendance.markAll('present');
        });

        document.getElementById('markAllAbsent').addEventListener('click', () => {
            this.attendance.markAll('absent');
        });

        document.getElementById('submitAttendance').addEventListener('click', () => {
            this.submitAttendance();
        });

        // Report controls
        document.getElementById('reportType').addEventListener('change', (e) => {
            this.reports.updateFilters(e.target.value);
        });

        document.getElementById('generateReport').addEventListener('click', () => {
            this.generateReport();
        });

        document.getElementById('exportPDF').addEventListener('click', () => {
            this.reports.exportToPDF();
        });

        // Change Password button
        document.getElementById('changePasswordBtn').addEventListener('click', () => {
            this.openChangePasswordModal();
        });
        document.getElementById('closeChangePasswordModal').addEventListener('click', () => {
            this.closeChangePasswordModal();
        });
        document.getElementById('cancelChangePassword').addEventListener('click', () => {
            this.closeChangePasswordModal();
        });
        document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleChangePassword();
        });

        // Signup button and modal
        document.getElementById('signupBtn').addEventListener('click', () => {
            this.openSignupModal();
        });
        document.getElementById('closeSignupModal').addEventListener('click', () => {
            this.closeSignupModal();
        });
        document.getElementById('cancelSignup').addEventListener('click', () => {
            this.closeSignupModal();
        });
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Remove User button and modal
        document.getElementById('removeUserBtn').addEventListener('click', () => {
            this.openRemoveUserModal();
        });
        document.getElementById('closeRemoveUserModal').addEventListener('click', () => {
            this.closeRemoveUserModal();
        });
        document.getElementById('cancelRemoveUser').addEventListener('click', () => {
            this.closeRemoveUserModal();
        });
        document.getElementById('removeUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRemoveUser();
        });
    }

    async checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (token && this.auth.isValidToken(token)) {
            const userData = this.auth.getUserFromToken(token);
            this.showDashboard(userData);
        } else {
            this.showLogin();
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const result = await this.auth.login(email, password);
            if (result.success) {
                this.showDashboard(result.user);
                this.ui.showMessage('Login successful!', 'success');
            } else {
                this.ui.showError('loginError', result.message);
            }
        } catch (error) {
            this.ui.showError('loginError', 'Login failed. Please try again.');
        }
    }

    handleLogout() {
        this.auth.logout();
        this.showLogin();
        this.ui.showMessage('Logged out successfully!', 'success');
    }

    showLogin() {
        this.ui.showPage('loginPage');
        document.getElementById('loginForm').reset();
        this.ui.hideError('loginError');
    }

    showDashboard(userData) {
        this.ui.showPage('dashboardPage');
        document.getElementById('userWelcome').textContent = `Welcome, ${userData.name}`;
        // Show signup and remove user buttons only for admin
        if (userData.role === 'admin') {
            document.getElementById('signupBtn').style.display = 'inline-block';
            document.getElementById('removeUserBtn').style.display = 'inline-block';
        } else {
            document.getElementById('signupBtn').style.display = 'none';
            document.getElementById('removeUserBtn').style.display = 'none';
        }
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('attendanceDate').value = today;
        // Initialize reports filters
        this.reports.updateFilters('daily');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    async loadStudents() {
        const date = document.getElementById('attendanceDate').value;
        const year = document.getElementById('yearSelect').value;
        const section = document.getElementById('sectionSelect').value;

        if (!date || !year || !section) {
            this.ui.showMessage('Please select date, year, and section', 'error');
            return;
        }

        try {
            await this.attendance.loadStudents(year, section, date);
            document.getElementById('attendanceActions').style.display = 'flex';
        } catch (error) {
            this.ui.showMessage('Failed to load students', 'error');
        }
    }

    async submitAttendance() {
        const date = document.getElementById('attendanceDate').value;
        const year = document.getElementById('yearSelect').value;
        const section = document.getElementById('sectionSelect').value;

        try {
            const result = await this.attendance.submitAttendance(date, year, section);
            if (result.success) {
                this.ui.showMessage('Attendance submitted successfully!', 'success');
            } else {
                this.ui.showMessage(result.message, 'error');
            }
        } catch (error) {
            this.ui.showMessage('Failed to submit attendance', 'error');
        }
    }

    async generateReport() {
        const reportType = document.getElementById('reportType').value;
        
        try {
            await this.reports.generateReport(reportType);
            document.getElementById('exportPDF').style.display = 'inline-block';
        } catch (error) {
            this.ui.showMessage('Failed to generate report', 'error');
        }
    }

    openChangePasswordModal() {
        document.getElementById('changePasswordModal').style.display = 'block';
        document.getElementById('changePasswordForm').reset();
        document.getElementById('changePasswordError').textContent = '';
        document.getElementById('changePasswordSuccess').textContent = '';
    }

    closeChangePasswordModal() {
        document.getElementById('changePasswordModal').style.display = 'none';
    }

    async handleChangePassword() {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        const errorDiv = document.getElementById('changePasswordError');
        const successDiv = document.getElementById('changePasswordSuccess');
        errorDiv.textContent = '';
        successDiv.textContent = '';

        if (newPassword !== confirmNewPassword) {
            errorDiv.textContent = 'New passwords do not match.';
            return;
        }
        if (newPassword.length < 6) {
            errorDiv.textContent = 'New password must be at least 6 characters.';
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            const data = await response.json();
            if (data.success) {
                successDiv.textContent = 'Password changed successfully!';
                setTimeout(() => {
                    this.closeChangePasswordModal();
                }, 1500);
            } else {
                errorDiv.textContent = data.message || 'Failed to change password.';
            }
        } catch (error) {
            errorDiv.textContent = 'Server error. Please try again.';
        }
    }

    openSignupModal() {
        document.getElementById('signupModal').style.display = 'block';
        document.getElementById('signupForm').reset();
        document.getElementById('signupError').textContent = '';
        document.getElementById('signupSuccess').textContent = '';
    }

    closeSignupModal() {
        document.getElementById('signupModal').style.display = 'none';
    }

    async handleSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        const department = document.getElementById('signupDepartment').value;
        const errorDiv = document.getElementById('signupError');
        const successDiv = document.getElementById('signupSuccess');
        errorDiv.textContent = '';
        successDiv.textContent = '';
        if (password.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters.';
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, username, password, department })
            });
            const data = await response.json();
            if (data.success) {
                successDiv.textContent = 'User added successfully!';
                setTimeout(() => {
                    this.closeSignupModal();
                }, 1500);
            } else {
                errorDiv.textContent = data.message || 'Failed to add user.';
            }
        } catch (error) {
            errorDiv.textContent = 'Server error. Please try again.';
        }
    }

    openRemoveUserModal() {
        document.getElementById('removeUserModal').style.display = 'block';
        document.getElementById('removeUserForm').reset();
        document.getElementById('removeUserError').textContent = '';
        document.getElementById('removeUserSuccess').textContent = '';
    }

    closeRemoveUserModal() {
        document.getElementById('removeUserModal').style.display = 'none';
    }

    async handleRemoveUser() {
        const username = document.getElementById('removeUsername').value;
        const errorDiv = document.getElementById('removeUserError');
        const successDiv = document.getElementById('removeUserSuccess');
        errorDiv.textContent = '';
        successDiv.textContent = '';
        if (!username) {
            errorDiv.textContent = 'Username is required.';
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/auth/remove-user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if (data.success) {
                successDiv.textContent = 'User removed successfully!';
                setTimeout(() => {
                    this.closeRemoveUserModal();
                }, 1500);
            } else {
                errorDiv.textContent = data.message || 'Failed to remove user.';
            }
        } catch (error) {
            errorDiv.textContent = 'Server error. Please try again.';
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});