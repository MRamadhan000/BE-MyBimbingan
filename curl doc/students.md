# Students API Documentation

Base URL: `http://localhost:3000`

**Note:** All endpoints require authentication (JWT token in cookie).

## Get My Statistics

**Endpoint:** `GET /students/me/statistics`

**Description:** Get statistics for the authenticated student, including submission counts, enrollment info, and feedback received.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/students/me/statistics \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Student statistics retrieved successfully",
  "data": {
    "student": {
      "id": "student-uuid",
      "name": "John Doe",
      "studentNumber": "123456789",
      "major": "Computer Science"
    },
    "statistics": {
      "totalEnrollments": 2,
      "totalSubmissions": 5,
      "submissionsByStatus": {
        "pending": 1,
        "revision": 2,
        "approved": 2
      },
      "totalFeedbacks": 3,
      "lecturers": [
        {
          "id": "lecturer-uuid-1",
          "name": "Dr. Jane Smith"
        },
        {
          "id": "lecturer-uuid-2",
          "name": "Prof. John Johnson"
        }
      ]
    }
  }
}
```