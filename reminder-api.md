# Reminder API Specs

## add Reminder
Endpoint : POST ``/api/v1/reminder``

Header:
- Authorization: token barrier
### Response Body Success
```json
{
  "success": true,
  message: "Reminders created successfully",
  "data": {
    
  },
}
```
### Response Body Error
```json
{
  "status": false,
  "message": "Failed to add reminder"
}
```

## Get All Predicts
Endpoint : GET ``/api/v1/reminder``

Header:
- Authorization: token barrier

### Response Body Success
```json
{
  "success": true,
  "message": "successful retrieve reminder",
  "data":{
    
  }
}
```
### Response Body Error
```json
{
  "status": false,
  "message": "Failed to get reminder"
}
```
## Get Reminders
Endpoint : GET ``/api/v1/predicts/:id``

Header:
- Authorization: token barrier
### Response Body Success
```json
{
  "success": true,
  "message": "successful get predict history",
  "data": {
    
  }
}
```
### Response Body Error
```json
{
  "status": false,
  "message": "Failed to get predict history"
}
```
## Delete Reminders
Endpoint : DELETE ``/api/v1/predicts/:id``

Header:
- Authorization: token barrier
### Response Body Success
```json
{
  "status": true,
  "message": "reminder deleted successfully"
}
```
### Response Body Error
```json
{
  "status": false,
  "message": "Failed to delete reminder"
}
```

