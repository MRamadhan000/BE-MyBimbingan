# Enrollments API Documentation

Base URL: `http://localhost:3000`

**Note:** All endpoints require authentication (JWT token in cookie).

## Create Enrollment

**Endpoint:** `POST /enrollments`

**Description:** Create a new enrollment between a student and lecturer.

**Request Body:**
```json
{
  "lecturerId": "lecturer-uuid"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:3000/enrollments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "lecturerId": "lecturer-uuid"
  }'
```

**Response (Success):**
```json
{
  "message": "Enrollment created successfully",
  "data": {
    "id": "enrollment-uuid",
    "student": {
      "id": "student-uuid",
      "name": "John Doe"
    },
    "lecturer": {
      "id": "lecturer-uuid",
      "name": "Dr. Jane Smith"
    },
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Get All Enrollments

**Endpoint:** `GET /enrollments`

**Description:** Get all enrollments.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/enrollments \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Enrollments retrieved successfully",
  "data": [
    {
      "id": "enrollment-uuid-1",
      "student": {
        "id": "student-uuid-1",
        "name": "John Doe"
      },
      "lecturer": {
        "id": "lecturer-uuid-1",
        "name": "Dr. Jane Smith"
      },
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": "enrollment-uuid-2",
      "student": {
        "id": "student-uuid-2",
        "name": "Jane Doe"
      },
      "lecturer": {
        "id": "lecturer-uuid-1",
        "name": "Dr. Jane Smith"
      },
      "createdAt": "2023-01-02T00:00:00.000Z"
    }
  ]
}
```

## Get My Enrollments

**Endpoint:** `GET /enrollments/my`

**Description:** Get all enrollments for the currently authenticated student.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/enrollments/my \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "My enrollments retrieved successfully",
  "data": [
    {
      "id": "enrollment-uuid-1",
      "student": {
        "id": "current-student-uuid",
        "name": "Current Student"
      },
      "lecturer": {
        "id": "lecturer-uuid-1",
        "name": "Dr. Jane Smith"
      },
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": "enrollment-uuid-2",
      "student": {
        "id": "current-student-uuid",
        "name": "Current Student"
      },
      "lecturer": {
        "id": "lecturer-uuid-2",
        "name": "Dr. John Doe"
      },
      "createdAt": "2023-01-02T00:00:00.000Z"
    }
  ]
}
```

## Get Enrollment by ID

**Endpoint:** `GET /enrollments/:id`

**Description:** Get a specific enrollment by ID.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/enrollments/enrollment-uuid \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Enrollment retrieved successfully",
  "data": {
    "id": "enrollment-uuid",
    "student": {
      "id": "student-uuid",
      "name": "John Doe"
    },
    "lecturer": {
      "id": "lecturer-uuid",
      "name": "Dr. Jane Smith"
    },
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Delete Enrollment

**Endpoint:** `DELETE /enrollments/:id`

**Description:** Delete an enrollment by ID.

**Curl Command:**
```bash
curl -X DELETE http://localhost:3000/enrollments/enrollment-uuid \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Enrollment deleted successfully"
}
```