# predict API specs

## Post Predict
Endpoint : POST ``/api/v1/predicts``

Header:
- Authorization: token barrier
### Response Body Success
```json
{
  "success": true,
  "message": "Prediction successfully",
  "data": {
    "prediction": { 
      "category": "glasses", 
      "confidence": 69 },
    "tips": "daur ulang lah",
    "result_id": 23213,
    "photo_url": "https://example.net/photo.jpg"
  }
}
```
### Response Body Error
```json
{
  "status": false,
  "message": "Failed to predict"
}
```

## Get All Predicts
Endpoint : GET ``/api/v1/predicts``

Header:
- Authorization: token barrier

### Response Body Success
```json
{
  "success": true,
  "message": "successful retrieve history prediction",
  "current_page": 1,
  "total_data": 5,
  "total_page": 1,
  "data":{
    
  }
}
```
### Response Body Error
```json
{
  "status": false,
  "message": "Failed to get predicts"
}
```
## Get Predict
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
## Delete Predict
Endpoint : DELETE ``/api/v1/predicts/:id``

Header:
- Authorization: token barrier
### Response Body Success
```json
{
  "status": true,
  "message": "Prediction history and related results deleted successfully"
}
```
### Response Body Error
```json
{
  "status": false,
  "message": "Failed to delete prediction history"
}
```

