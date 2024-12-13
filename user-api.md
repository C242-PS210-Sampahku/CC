# users API specs

## Register User API

Endpoint : POST ``/api/v1/register``

### body request
```json
{
  "email": "test@example.com",
  "password": "passWod12",
  "username": "tebstuser",
  "name": "Test User",
  "gender": "male",
  "photoProfile": "path://to/your/file",
  "no_hp": "081213209890" 
}
```
require
```json
{
  "email": "testg@example.com",
  "password": "passWod12",
  "username": "tebstuser",
  "name": "Test User",
  "gender": "male"
}
```
```
password = At least 8 characters, no spesial character, upper and lowercase
username = At least 3 and max 256 characters
name = cannot exceed 255 characters 
gender = male or female
```

### Response Body Success
```json
{
    "status": true,
    "message": "User registered",
    "data": {
        "user_id": "w1q8iBHVhkh6RLok7T7SGMNQoX92",
        "name": "test2",
        "gender": "male",
        "username": "testt",
        "email": "test@example.com",
        "no_hp": null,
        "img_url": "https://storage.googleapis.com/bucket-name/profile-images/profile-2024-12-.309Z.png",
        "created_at": "2024-12-03T12:07:30.000Z",
        "updated_at": "2024-12-03T12:07:30.000Z"
    }
}
```
### Response Body Error
```json
{
    "status": false,
    "message": "Validation failed",
    "errors": [
        {
            "type": "field",
            "value": "paswordd",
            "msg": "Password must contain at least one uppercase letter, one lowercase letter, and one number, without symbols",
            "path": "password",
            "location": "body"
        }
    ]
}
```

## Login User API
Endpoint : POST ``/api/v1/login``
### body request
```json
{
  "email": "example@test.com",
  "password": "examplePass"
}
```
### Response Body Success
```json
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "user": {
            "uid": "wdfs1q8iBHVhkh6RLok7T7SGMNQoX92",
            "email": "test@example.com",
            "emailVerified": false,
            "displayName": "test2",
            "isAnonymous": false,
            "providerData": [
                {
                    "providerId": "password",
                    "uid": "test@example.com",
                    "displayName": "test2",
                    "email": "test@example.com",
                    "phoneNumber": null,
                    "photoURL": null
                }
            ],
            "stsTokenManager": {
                "refreshToken": "refreshtoken",
                "accessToken": "accestoken",
                "expirationTime": 1733273430849
            },
            "createdAt": "1733227649099",
            "lastLoginAt": "1733269830500",
            "apiKey": "apikeyy",
            "appName": "[DEFAULT]"
        },
        "providerId": null,
        "_tokenResponse": {
            "kind": "identitytoolkit#VerifyPasswordResponse",
            "localId": "localId",
            "email": "test@example.com",
            "displayName": "test2",
            "idToken": "tokenId",
            "registered": true,
            "refreshToken": "refreshtoken",
            "expiresIn": "3600"
        },
        "operationType": "signIn"
    }
}
```
### Response Body Error
```json
{
  "status": false,
  "message": "Authentication failed",
  "errors": "Firebase: Error (auth/invalid-credential)."
}
```


## Update User API

Endpoint : put ``/api/v1/users``

Header :
- Authorization: token barrier

require token to update
user_id came from token

changeble
```json
{
  "photoProfile": "photoProfile",
  "userName": "userName",
  "name":  "name",
  "noHp":  "noHp",
  "gender": "gender"
}
```

### Response Body Success
```json
{
    "status": "success",
    "message": "User updated successfully",
    "data": {
        "user_id": "w1q8iBHVhkh6RLok7T7SGMNQoX92",
        "name": "test2",
        "gender": "male",
        "username": "testt",
        "email": "test@example.com",
        "no_hp": null,
        "img_url": "https://storage.googleapis.com/sampahku-storage/profile-images/profile-2024-12-04T00:32:12.342Z.png",
        "created_at": "2024-12-03T12:07:30.000Z",
        "updated_at": "2024-12-04T00:32:13.000Z"
    }
}
```
### Response Body Error
```json
{
    "status": false,
    "message": "Invalid or expired token",
    "errors": {
        "code": "auth/argument-error",
        "message": "Decoding Firebase ID token failed. Make sure you passed the entire string JWT which represents an ID token. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token."
    }
}
```


## Get User API
Endpoint : GET ``/api/v1/users``

Header :
- Authorization: token barrier

using token-barrier to find user_id
### Response Body Success
```json
{
    "status": true,
    "message": "User found",
    "data": {
        "user_id": "w1q8iBHVhkh6RLok7T7SGMNQoX92",
        "name": "test2",
        "gender": "male",
        "username": "testt",
        "email": "test@example.com",
        "no_hp": null,
        "img_url": "https://storage.googleapis.com/sampahku-storage/profile-images/profile-2024-12-04T00:32:12.342Z.png",
        "created_at": "2024-12-03T12:07:30.000Z",
        "updated_at": "2024-12-04T00:32:13.000Z"
    }
}
```
### Response Body Error
```json
{
    "status": false,
    "message": "Invalid or expired token",
    "errors": {
        "code": "auth/argument-error",
        "message": "Decoding Firebase ID token failed. Make sure you passed the entire string JWT which represents an ID token. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token."
    }
}
```
# Delete User API
Endpoint : DELETE ``/api/v1/users``

Header:
- Authorization: token barrier

require token. user_id came from token

### Response Body Success
```json
{
    "status": "success",
    "message": "User deleted successfully"
}
```
### Response Body Error
```json
{
    "status": false,
    "message": "Invalid or expired token",
    "errors": {
        "code": "auth/argument-error",
        "message": "Decoding Firebase ID token failed. Make sure you passed the entire string JWT which represents an ID token. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token."
    }
}
```
