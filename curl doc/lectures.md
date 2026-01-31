# Lecturers API Documentation

Base URL: `http://localhost:3000`

**Note:** All endpoints require authentication (JWT token in cookie).

## Get All Lecturers

**Endpoint:** `GET /lecturers`

**Description:** Retrieve a list of all lecturers.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/lecturers \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Lecturers retrieved successfully",
  "data": [
    {
      "id": "lecturer-uuid-1",
      "name": "Dr. John Doe",
      "nuptk": "1234567890",
      "interests": ["Machine Learning", "Data Science"],
      "image": "profile.jpg",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    {
      "id": "lecturer-uuid-2",
      "name": "Dr. Jane Smith",
      "nuptk": "0987654321",
      "interests": ["Web Development", "AI"],
      "image": null,
      "createdAt": "2023-01-02T00:00:00.000Z"
    }
  ]
}
```

**Response (Error - Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Response (Error - Forbidden):**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## Get Lecturer by ID

**Endpoint:** `GET /lecturers/:id`

**Description:** Retrieve a specific lecturer by their ID.

**Parameters:**
- `id` (path parameter): UUID of the lecturer

**Curl Command:**
```bash
curl -X GET http://localhost:3000/lecturers/lecturer-uuid \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Lecturer retrieved successfully",
  "data": {
    "id": "lecturer-uuid",
    "name": "Dr. John Doe",
    "nuptk": "1234567890",
    "interests": ["Machine Learning", "Data Science"],
    "image": "profile.jpg",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Response (Error - Not Found):**
```json
{
  "statusCode": 404,
  "message": "Dosen dengan ID lecturer-uuid tidak ditemukan"
}
```

**Response (Error - Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Response (Error - Forbidden):**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```