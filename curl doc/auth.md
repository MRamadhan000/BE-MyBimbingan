# Auth API Documentation

Base URL: `http://localhost:3000`

## Student Registration

**Endpoint:** `POST /auth/student/register`

**Description:** Register a new student account.

**Request Body:**
```json
{
  "name": "John Doe",
  "studentNumber": "123456789",
  "major": "Computer Science",
  "password": "password123",
  "image": "https://example.com/image.jpg"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:3000/auth/student/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "studentNumber": "123456789",
    "major": "Computer Science",
    "password": "password123",
    "image": "https://example.com/image.jpg"
  }'
```

**Response (Success):**
```json
{
  "message": "Student registered successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe"
  }
}
```

## Student Login

**Endpoint:** `POST /auth/student/login`

**Description:** Login as a student and receive JWT token in cookie.

**Request Body:**
```json
{
  "studentNumber": "123456789",
  "password": "password123"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:3000/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "studentNumber": "123456789",
    "password": "password123"
  }' \
  -c cookies.txt
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "role": "student"
  }
}
```

## Lecturer Registration

**Endpoint:** `POST /auth/lecturer/register`

**Description:** Register a new lecturer account.

**Request Body:**
```json
{
  "name": "Dr. Jane Smith",
  "nuptk": "987654321",
  "interests": ["Machine Learning", "Data Science"],
  "password": "password123",
  "image": "https://example.com/image.jpg"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:3000/auth/lecturer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Jane Smith",
    "nuptk": "987654321",
    "interests": ["Machine Learning", "Data Science"],
    "password": "password123",
    "image": "https://example.com/image.jpg"
  }'
```

**Response (Success):**
```json
{
  "message": "Lecturer registered successfully",
  "data": {
    "id": "uuid",
    "name": "Dr. Jane Smith"
  }
}
```

## Lecturer Login

**Endpoint:** `POST /auth/lecturer/login`

**Description:** Login as a lecturer and receive JWT token in cookie.

**Request Body:**
```json
{
  "nuptk": "987654321",
  "password": "password123"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:3000/auth/lecturer/login \
  -H "Content-Type: application/json" \
  -d '{
    "nuptk": "987654321",
    "password": "password123"
  }' \
  -c cookies.txt
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "data": {
    "id": "uuid",
    "name": "Dr. Jane Smith",
    "role": "lecturer"
  }
}
```

## Get Student Profile

**Endpoint:** `GET /auth/student/me`

**Description:** Get current student profile (requires authentication).

**Curl Command:**
```bash
curl -X GET http://localhost:3000/auth/student/me \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Student data retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "studentNumber": "123456789",
    "major": "Computer Science",
    "image": "https://example.com/image.jpg",
    "role": "student",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Get Lecturer Profile

**Endpoint:** `GET /auth/lecturer/me`

**Description:** Get current lecturer profile (requires authentication).

**Curl Command:**
```bash
curl -X GET http://localhost:3000/auth/lecturer/me \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Lecturer data retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Dr. Jane Smith",
    "nuptk": "987654321",
    "interests": ["Machine Learning", "Data Science"],
    "image": "https://example.com/image.jpg",
    "role": "lecturer",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logout and clear JWT token cookie (requires authentication).

**Curl Command:**
```bash
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Logout successful"
}
```