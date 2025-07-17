# CRT Attendance Management System

A comprehensive attendance management system for the AIML Department at Vishnu Institute of Technology.

## Features

### Authentication & Security
- Secure login system with JWT authentication
- Access restricted to 10 authorized AIML faculty members
- Password encryption using bcrypt
- Session management with token expiration
- Input validation and data sanitization
- Rate limiting and CORS protection

### Daily Attendance Management
- Date picker for selecting attendance date
- Year and section selection (2nd/3rd/4th year, Section A/B)
- Student list with register numbers and names
- Present/Absent radio button selection
- Bulk actions (Mark All Present/Absent)
- Real-time attendance submission with confirmation

### Comprehensive Reporting
- **Daily Reports**: View attendance for specific dates
- **Monthly Reports**: Generate monthly attendance summaries
- **Yearly Reports**: Annual attendance analysis
- **Individual Student Reports**: Track specific student attendance
- Export functionality to PDF format
- Sortable tables with attendance statistics
- Attendance percentage calculations

### Dashboard Features
- Clean, professional interface with responsive design
- Tab-based navigation (Daily Attendance & Reports)
- Real-time data updates
- User-friendly error handling and success messages
- Mobile-responsive design for all screen sizes

## Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **PDF Generation**: jsPDF with AutoTable
- **Development**: Vite for build tooling

## Database Schema

### Faculty Collection
- 10 authorized faculty members
- Encrypted passwords
- Department association (AIML)
- Login tracking

### Student Collection
- 450 students (150 per year: 2nd, 3rd, 4th)
- 75 students per section (A & B)
- Unique register numbers
- Department classification

### Attendance Collection
- Daily attendance records
- Student-date unique constraints
- Faculty tracking (who marked attendance)
- Efficient indexing for fast queries

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crt-attendance-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env file with your MongoDB URI and JWT secret
   ```

4. **Start MongoDB**
   - Ensure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/crt_attendance`

5. **Run the application**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Default Login Credentials

The system comes pre-seeded with 10 faculty accounts:

| Email | Username | Password |
|-------|----------|----------|
| rajesh.kumar@vit.edu | rajesh.kumar | password123 |
| priya.sharma@vit.edu | priya.sharma | password123 |
| amit.patel@vit.edu | amit.patel | password123 |
| sunita.reddy@vit.edu | sunita.reddy | password123 |
| vikram.singh@vit.edu | vikram.singh | password123 |
| meera.gupta@vit.edu | meera.gupta | password123 |
| ravi.krishnan@vit.edu | ravi.krishnan | password123 |
| kavitha.nair@vit.edu | kavitha.nair | password123 |
| suresh.babu@vit.edu | suresh.babu | password123 |
| lakshmi.devi@vit.edu | lakshmi.devi | password123 |

**Note**: Change these passwords in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Faculty login
- `GET /api/auth/verify` - Token verification

### Attendance Management
- `GET /api/attendance/students` - Get students for attendance
- `POST /api/attendance/submit` - Submit attendance data

### Reports
- `GET /api/reports/daily` - Generate daily reports
- `GET /api/reports/monthly` - Generate monthly reports
- `GET /api/reports/yearly` - Generate yearly reports
- `GET /api/reports/student` - Generate individual student reports

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password encryption
- **Input Validation**: Express-validator for data validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Cross-origin request security
- **Helmet**: Security headers for Express apps
- **Data Sanitization**: Protection against injection attacks

## Production Deployment

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI
   - Use strong JWT secret
   - Set appropriate CORS origins

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Security Considerations**
   - Change default passwords
   - Use HTTPS in production
   - Configure firewall rules
   - Regular security updates
   - Database backup strategy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the AIML Department at Vishnu Institute of Technology.

---

**Vishnu Institute of Technology - AIML Department**  
*Empowering Education Through Technology*