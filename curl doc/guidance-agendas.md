# Guidance Agendas API Documentation

Base URL: `http://localhost:3000`

**Note:** All endpoints require authentication (JWT token in cookie). Lecturer can create, read, update, delete their own agendas. Students can only read agendas related to them.

## Create Guidance Agenda

**Endpoint:** `POST /guidance-agendas`

**Description:** Create a new guidance agenda. Only lecturers can create agendas for themselves.

**Request Body:**
```json
{
  "type": "online",
  "location": "Meeting Room A",
  "meetingLink": "https://zoom.us/meeting",
  "date": "2023-12-01",
  "startTime": "10:00",
  "endTime": "11:00",
  "status": "upcoming"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:3000/guidance-agendas \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "type": "online",
    "location": "Meeting Room A",
    "meetingLink": "https://zoom.us/meeting",
    "date": "2023-12-01",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "upcoming"
  }'
```

**Response (Success):**
```json
{
  "id": "agenda-uuid",
  "type": "online",
  "location": "Meeting Room A",
  "meetingLink": "https://zoom.us/meeting",
  "date": "2023-12-01",
  "startTime": "10:00",
  "endTime": "11:00",
  "status": "upcoming",
  "lecturer": {
    "id": "lecturer-uuid",
    "name": "Dr. Jane Smith"
  },
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

## Get All Guidance Agendas

**Endpoint:** `GET /guidance-agendas`

**Description:** Retrieve all guidance agendas. Access based on user role.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/guidance-agendas \
  -b cookies.txt
```

**Response (Success):**
```json
[
  {
    "id": "agenda-uuid",
    "type": "offline",
    "location": "Campus Library",
    "date": "2023-12-01",
    "startTime": "14:00",
    "endTime": "15:00",
    "status": "active",
    "lecturer": {
      "id": "lecturer-uuid",
      "name": "Dr. Jane Smith"
    }
  }
]
```

## Get Guidance Agendas by Lecturer

**Endpoint:** `GET /guidance-agendas/lecturer/{lecturerId}`

**Description:** Retrieve guidance agendas for a specific lecturer.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/guidance-agendas/lecturer/lecturer-uuid \
  -b cookies.txt
```

**Response (Success):**
```json
[
  {
    "id": "agenda-uuid",
    "type": "online",
    "meetingLink": "https://zoom.us/meeting",
    "date": "2023-12-01",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "upcoming",
    "lecturer": {
      "id": "lecturer-uuid",
      "name": "Dr. Jane Smith"
    }
  }
]
```

## Get Guidance Agenda by ID

**Endpoint:** `GET /guidance-agendas/{id}`

**Description:** Retrieve a specific guidance agenda by ID.

**Curl Command:**
```bash
curl -X GET http://localhost:3000/guidance-agendas/agenda-uuid \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "id": "agenda-uuid",
  "type": "offline",
  "location": "Campus Library",
  "date": "2023-12-01",
  "startTime": "14:00",
  "endTime": "15:00",
  "status": "active",
  "lecturer": {
    "id": "lecturer-uuid",
    "name": "Dr. Jane Smith"
  }
}
```

## Update Guidance Agenda

**Endpoint:** `PATCH /guidance-agendas/{id}`

**Description:** Update a guidance agenda. Only the lecturer who owns the agenda can update it.

**Request Body:**
```json
{
  "status": "active",
  "location": "Updated Location"
}
```

**Curl Command:**
```bash
curl -X PATCH http://localhost:3000/guidance-agendas/agenda-uuid \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "status": "active",
    "location": "Updated Location"
  }'
```

**Response (Success):**
```json
{
  "id": "agenda-uuid",
  "type": "offline",
  "location": "Updated Location",
  "date": "2023-12-01",
  "startTime": "14:00",
  "endTime": "15:00",
  "status": "active",
  "lecturer": {
    "id": "lecturer-uuid",
    "name": "Dr. Jane Smith"
  }
}
```

## Delete Guidance Agenda

**Endpoint:** `DELETE /guidance-agendas/{id}`

**Description:** Delete a guidance agenda. Only the lecturer who owns the agenda can delete it.

**Curl Command:**
```bash
curl -X DELETE http://localhost:3000/guidance-agendas/agenda-uuid \
  -b cookies.txt
```

**Response (Success):**
```json
{
  "message": "Guidance agenda deleted successfully"
}
```