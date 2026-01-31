# Submissions API Documentation

Base URL: `http://localhost:3000`

**Note:** All endpoints require authentication (JWT token in cookie). Students can create, read, update their own submissions. Lecturers can read, review, and approve submissions.

## Create Submission

**Endpoint:** `POST /submissions`

**Description:** Create a new submission. Only students can create submissions for themselves. Files are stored securely in the database server. You need to get the `enrollmentId` from the enrollments endpoint first. **Important:** This endpoint requires `multipart/form-data` content type, not JSON.

**Request Body (Form Data):**
- `title`: "Final Project Submission"
- `description`: "This is my final project submission"
- `enrollmentId`: "enrollment-uuid"
- `parentId`: "parent-submission-uuid" (optional)
- `files`: (multiple files, max 5MB each)

**Curl Command:**
```bash
curl -X POST http://localhost:3000/submissions \
  -F "title=Final Project Submission" \
  -F "description=This is my final project submission" \
  -F "enrollmentId=enrollment-uuid" \
  -F "files=@/path/to/file1.pdf" \
  -b cookies.txt
```

**Note:** Use `-F` flags for form data, not `-d` with JSON. Files must be uploaded as multipart/form-data.

**Response (Success):**
```json
{
  "id": "submission-uuid",
  "title": "Final Project Submission",
  "description": "This is my final project submission",
  "status": "draft",
  "student": {
    "id": "student-uuid",
    "name": "John Doe"
  },
  "lecturer": {
    "id": "lecturer-uuid",
    "name": "Dr. Jane Smith"
  },
  "attachments": [
    {
      "id": "attachment-uuid",
      "fileName": "file1.pdf",
      "fileSize": "2048000",
      "mimeType": "application/pdf"
    }
  ],
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

## Get All Submissions

**Endpoint:** `GET /submissions`

**Description:** Retrieve all submissions. Access based on user role.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/submissions \
  -b cookies.txt
```

**Response (Success):**
```json
[
  {
    "id": "submission-uuid",
    "title": "Final Project Submission",
    "description": "This is my final project submission",
    "status": "submitted",
    "student": {
      "id": "student-uuid",
      "name": "John Doe"
    },
    "lecturer": {
      "id": "lecturer-uuid",
      "name": "Dr. Jane Smith"
    }
  }
]
```

## Get Submission by ID

**Endpoint:** `GET /submissions/{id}`

**Description:** Retrieve a specific submission by ID.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/submissions/submission-uuid \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "id": "submission-uuid",
  "title": "Final Project Submission",
  "description": "This is my final project submission",
  "status": "submitted",
  "student": {
    "id": "student-uuid",
    "name": "John Doe"
  },
  "lecturer": {
    "id": "lecturer-uuid",
    "name": "Dr. Jane Smith"
  },
  "attachments": [],
  "feedbacks": []
}
```

## Create Feedback

**Endpoint:** `POST /submissions/feedbacks`

**Description:** Create feedback for a submission. Only lecturers can create feedback.

**Request Body:**
```json
{
  "submissionId": "submission-uuid",
  "content": "Good work, but needs revision",
  "status": "NEEDS_REVISION"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:3000/submissions/feedbacks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "submissionId": "submission-uuid",
    "content": "Good work, but needs revision",
    "status": "NEEDS_REVISION"
  }'
```

**Response (Success):**
```json
{
  "id": "feedback-uuid",
  "content": "Good work, but needs revision",
  "status": "NEEDS_REVISION",
  "submission": {
    "id": "submission-uuid"
  },
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

## Get Feedbacks for Submission

**Endpoint:** `GET /submissions/{id}/feedbacks`

**Description:** Retrieve all feedbacks for a specific submission.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/submissions/submission-uuid/feedbacks \
  -b cookies.txt
```

**Response (Success):**
```json
[
  {
    "id": "feedback-uuid",
    "content": "Good work, but needs revision",
    "status": "NEEDS_REVISION",
    "submission": {
      "id": "submission-uuid"
    },
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

## Review Submission

**Endpoint:** `PATCH /submissions/{id}/review`

**Description:** Review and update submission status. Only lecturers can review submissions.

**Request Body:**
```json
{
  "status": "approved",
  "comment": "Excellent work!"
}
```

**Curl Command:**
```bash
curl -X PATCH http://localhost:3000/submissions/submission-uuid/review \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "approved",
    "comment": "Excellent work!"
  }'
```

**Response (Success):**
```json
{
  "id": "submission-uuid",
  "title": "Final Project Submission",
  "status": "approved",
  "feedbacks": [
    {
      "id": "feedback-uuid",
      "content": "Excellent work!",
      "status": "APPROVED"
    }
  ]
}
```

## Download Attachment

**Endpoint:** `GET /submissions/attachments/{id}/download`

**Description:** Download a specific attachment file. Access based on user role and submission ownership.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/submissions/attachments/attachment-uuid/download \
  -b cookies.txt \
  -o downloaded-file.pdf
```

**Response (Success):** File downloaded as attachment.

## Delete Attachment

**Endpoint:** `DELETE /submissions/attachments/{id}`

**Description:** Delete an attachment from a submission. Only the student who owns the submission can delete attachments.

**Curl Command:**
```bash
curl -X DELETE http://localhost:3000/submissions/attachments/attachment-uuid \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Attachment deleted successfully"
}
```