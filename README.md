# Event Management System

A CAP-based application for managing events and participants, integrated with SAP S/4HANA Business Partner API.

## Prerequisites

- Node.js
- SAP Cloud Business Application Tools (for Business Application Studio)
- HANA Cloud Instance
- Access to S/4HANA Business Partner API

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```
3. Deploy to HANA:

```bash
cds deploy --to hana
```

4. Start the application:

```bash
cds watch --profile hybrid
```


## API Documentation

Please refer to the `test.http` file for the available endpoints

### 1. API Flow

#### Create Event

```http
### Create new event
POST {{host}}/odata/v4/event-catalog/Events
content-type: application/json

{
    "ID": 2,
    "Name": "New SAP Event",
    "StartDate": "2024-12-17",
    "EndDate": "2024-12-20",
    "Location": "Paris, France",
    "Description": "New event description",
    "IsActive": true,
    "IsCancelled": false
}
```

#### Create Participant

```http
### Create Participant
POST {{host}}/odata/v4/event-catalog/createParticipant
Content-Type: application/json

{
    "BusinessPartnerID": "1000000",
    "FirstName": "Vito",
    "LastName": "Corleone",
    "Email": "vito@example.com",
    "Phone": "1234567890"
}
```

#### Register Participant

```http
### Register Participant
POST {{host}}/odata/v4/event-catalog/registerParticipant
Content-Type: application/json

{
    "eventId": 1,
    "participantId": 7
}
```

#### Get Event Participants

```http
### Get Event Participants
GET {{host}}/odata/v4/event-catalog/getEventParticipants(eventId=1)
```

#### Cancel Event
```http
### Cancel Event (Bound Action)
POST {{host}}/odata/v4/event-catalog/Events({{eventId}})/cancelEvent
content-type: application/json

{
    "reason": "Cancelled because of bad weather"
}
```

#### Reopen Event

```http
### Reopen Event (Bound Action)
POST {{host}}/odata/v4/event-catalog/Events({{eventId}})/reopenEvent
```

## Data Model

### Events
- ID (key)
- Name
- Description
- StartDate
- EndDate
- Location
- IsActive
- IsCancelled
- CancellationReason

### Participants
- ID (key)
- BusinessPartnerID
- FirstName
- LastName
- Email
- Phone

### EventParticipants (Pivot/Junction Table)
- event_ID (key)
- participant_ID (key)
- registrationDate

## Business Partner API Integration

The application validates BusinessPartnerID against the S/4HANA Business Partner API during participant creation. The API endpoint and credentials are configured in `package.json`.

## Error Handling

The application includes comprehensive error handling for:
- Invalid Business Partner IDs
- Duplicate registrations
- Invalid event states
- Non-existent participants/events
- Validation errors

## Development Notes

- Uses CAP's built-in OData provider
- Implements bound and unbound actions and functions
- Includes transaction handling
- Integrates with remote OData service

## Testing

You can use the provided HTTP requests to test the API endpoints. These can be executed using REST clients like Postman or REST Client extension.