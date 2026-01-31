# Database Management Commands

## Quick Commands

### Reset Database (Drop + Sync + Seed)
```bash
npm run db:reset
```

### Individual Commands

#### Drop all database tables
```bash
npm run db:drop
```

#### Sync database schema (create tables)
```bash
npm run db:sync
```

#### Seed database with sample data
```bash
npm run db:seed
```

## Sample Data Created

### Students (10 users)
- **Student Number**: 2021001 - 2021010
- **Password**: 123456 (for all)
- **Major**: Computer Science, Information Systems, Software Engineering, Information Technology
- **Names**: Alice Johnson, Bob Smith, Charlie Brown, Diana Prince, Edward Norton, Fiona Green, George Wilson, Hannah Davis, Ivan Petrov, Julia Roberts

### Lecturers (10 users)
- **NUPTK**: 1001 - 1010
- **Password**: 123456 (for all)
- **Names**: Dr. Michael Anderson, Prof. Sarah Williams, Dr. David Chen, etc.
- **Interests**: Various tech specializations (Machine Learning, Web Development, etc.)

## Usage Examples

### Login as Student
```bash
curl -X POST http://localhost:3001/auth/student/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "studentNumber": "2021001",
    "password": "123456"
  }'
```

### Login as Lecturer
```bash
curl -X POST http://localhost:3001/auth/lecturer/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "nuptk": "1001",
    "password": "123456"
  }'
```