

# API Documentation

## VLESS User Management API

This document describes the REST API endpoints available for managing VLESS users both globally and for specific inbound instances.

### API Endpoints Overview

#### Global User Management
- `GET /users` - List all users in the global registry
- `POST /users` - Add a new user to the global registry and all inbounds
- `DELETE /users/delete?uuid=<uuid>` - Remove a user from the global registry and all inbounds

#### Inbound-specific User Management
- `GET /inbounds` - List all VLESS inbound tags
- `GET /inbounds/users?tag=<tag>` - List users for a specific inbound
- `POST /inbounds/users/add` - Add a user to a specific inbound
- `DELETE /inbounds/users/delete?tag=<tag>&uuid=<uuid>` - Remove a user from a specific inbound

### User Object Format

```json
{
  "name": "username",
  "uuid": "a1b2c3d4-e5f6-4321-8901-abcdef123456",
  "flow": "xtls-rprx-vision" // optional
}
```

### Examples

All examples assume the API is running on `localhost:8081`.

#### Global User Management

##### List All Users

**curl:**
```bash
curl -X GET http://localhost:8081/users
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/users" -Method Get
```

##### Add a New User

**curl:**
```bash
curl -X POST http://localhost:8081/users \
  -H "Content-Type: application/json" \
  -d '{"name":"newuser","uuid":"a1b2c3d4-e5f6-4321-8901-abcdef123456","flow":"xtls-rprx-vision"}'
```

**PowerShell:**
```powershell
$user = @{
  name = "newuser"
  uuid = "a1b2c3d4-e5f6-4321-8901-abcdef123456"
  flow = "xtls-rprx-vision"
}
$json = $user | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/users" -Method Post -Body $json -ContentType "application/json"
```

##### Delete a User

**curl:**
```bash
curl -X DELETE "http://localhost:8081/users/delete?uuid=a1b2c3d4-e5f6-4321-8901-abcdef123456"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/users/delete?uuid=a1b2c3d4-e5f6-4321-8901-abcdef123456" -Method Delete
```

#### Inbound-specific User Management

##### List All Inbounds

**curl:**
```bash
curl -X GET http://localhost:8081/inbounds
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/inbounds" -Method Get
```

##### List Users for a Specific Inbound

**curl:**
```bash
curl -X GET "http://localhost:8081/inbounds/users?tag=vless-in"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/inbounds/users?tag=vless-in" -Method Get
```

##### Add a User to a Specific Inbound

**curl:**
```bash
curl -X POST http://localhost:8081/inbounds/users/add \
  -H "Content-Type: application/json" \
  -d '{"tag":"vless-in","user":{"name":"inbounduser","uuid":"b2c3d4e5-f6a7-5432-1098-abcdef654321","flow":"xtls-rprx-vision"}}'
```

**PowerShell:**
```powershell
$data = @{
  tag = "vless-in"
  user = @{
    name = "inbounduser"
    uuid = "b2c3d4e5-f6a7-5432-1098-abcdef654321"
    flow = "xtls-rprx-vision"
  }
}
$json = $data | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/inbounds/users/add" -Method Post -Body $json -ContentType "application/json"
```

##### Delete a User from a Specific Inbound

**curl:**
```bash
curl -X DELETE "http://localhost:8081/inbounds/users/delete?tag=vless-in&uuid=b2c3d4e5-f6a7-5432-1098-abcdef654321"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/inbounds/users/delete?tag=vless-in&uuid=b2c3d4e5-f6a7-5432-1098-abcdef654321" -Method Delete
```

## HTTP User Management API

This section describes the REST API endpoints available for managing HTTP users both globally and for specific inbound instances.

### API Endpoints Overview

#### Global User Management
- `GET /http/users` - List all HTTP users in the global registry
- `POST /http/users` - Add a new HTTP user to the global registry and all inbounds
- `DELETE /http/users/delete?username=<username>` - Remove an HTTP user from the global registry and all inbounds

#### Inbound-specific User Management
- `GET /http/inbounds` - List all HTTP inbound tags
- `GET /http/inbounds/users?tag=<tag>` - List HTTP users for a specific inbound
- `POST /http/inbounds/users/add` - Add an HTTP user to a specific inbound
- `DELETE /http/inbounds/users/delete?tag=<tag>&username=<username>` - Remove an HTTP user from a specific inbound

### HTTP User Object Format

```json
{
  "username": "myusername",
  "password": "mypassword"
}
```

### Examples

All examples assume the API is running on `localhost:8081`.

#### Global User Management

##### List All HTTP Users

**curl:**
```bash
curl -X GET http://localhost:8081/http/users
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/http/users" -Method Get
```

##### Add a New HTTP User

**curl:**
```bash
curl -X POST http://localhost:8081/http/users \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"securepassword"}'
```

**PowerShell:**
```powershell
$user = @{
  username = "newuser"
  password = "securepassword"
}
$json = $user | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/http/users" -Method Post -Body $json -ContentType "application/json"
```

##### Delete an HTTP User

**curl:**
```bash
curl -X DELETE "http://localhost:8081/http/users/delete?username=newuser"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/http/users/delete?username=newuser" -Method Delete
```

#### Inbound-specific User Management

##### List All HTTP Inbounds

**curl:**
```bash
curl -X GET http://localhost:8081/http/inbounds
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/http/inbounds" -Method Get
```

##### List Users for a Specific HTTP Inbound

**curl:**
```bash
curl -X GET "http://localhost:8081/http/inbounds/users?tag=http-in"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/http/inbounds/users?tag=http-in" -Method Get
```

##### Add a User to a Specific HTTP Inbound

**curl:**
```bash
curl -X POST http://localhost:8081/http/inbounds/users/add \
  -H "Content-Type: application/json" \
  -d '{"tag":"http-in","user":{"username":"inbounduser","password":"inboundpass"}}'
```

**PowerShell:**
```powershell
$data = @{
  tag = "http-in"
  user = @{
    username = "inbounduser"
    password = "inboundpass"
  }
}
$json = $data | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/http/inbounds/users/add" -Method Post -Body $json -ContentType "application/json"
```

##### Delete a User from a Specific HTTP Inbound

**curl:**
```bash
curl -X DELETE "http://localhost:8081/http/inbounds/users/delete?tag=http-in&username=inbounduser"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/http/inbounds/users/delete?tag=http-in&username=inbounduser" -Method Delete
```

## TUIC User Management API

This section describes the REST API endpoints available for managing TUIC users both globally and for specific inbound instances.

### API Endpoints Overview

#### Global User Management
- `GET /tuic/users` - List all TUIC users in the global registry
- `POST /tuic/users` - Add a new TUIC user to the global registry and all inbounds
- `DELETE /tuic/users/delete?uuid=<uuid>` - Remove a TUIC user from the global registry and all inbounds

#### Inbound-specific User Management
- `GET /tuic/inbounds` - List all TUIC inbound tags
- `GET /tuic/inbounds/users?tag=<tag>` - List TUIC users for a specific inbound
- `POST /tuic/inbounds/users/add` - Add a TUIC user to a specific inbound
- `DELETE /tuic/inbounds/users/delete?tag=<tag>&uuid=<uuid>` - Remove a TUIC user from a specific inbound

### TUIC User Object Format

```json
{
  "uuid": "a1b2c3d4-e5f6-4321-8901-abcdef123456",
  "password": "securepassword",
  "name": "username" // optional
}
```

### Examples

All examples assume the API is running on `localhost:8081`.

#### Global User Management

##### List All TUIC Users

**curl:**
```bash
curl -X GET http://localhost:8081/tuic/users
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/tuic/users" -Method Get
```

##### Add a New TUIC User

**curl:**
```bash
curl -X POST http://localhost:8081/tuic/users \
  -H "Content-Type: application/json" \
  -d '{"uuid":"a1b2c3d4-e5f6-4321-8901-abcdef123456","password":"securepassword","name":"newuser"}'
```

**PowerShell:**
```powershell
$user = @{
  uuid = "a1b2c3d4-e5f6-4321-8901-abcdef123456"
  password = "securepassword"
  name = "newuser"
}
$json = $user | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/tuic/users" -Method Post -Body $json -ContentType "application/json"
```

##### Delete a TUIC User

**curl:**
```bash
curl -X DELETE "http://localhost:8081/tuic/users/delete?uuid=a1b2c3d4-e5f6-4321-8901-abcdef123456"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/tuic/users/delete?uuid=a1b2c3d4-e5f6-4321-8901-abcdef123456" -Method Delete
```

#### Inbound-specific User Management

##### List All TUIC Inbounds

**curl:**
```bash
curl -X GET http://localhost:8081/tuic/inbounds
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/tuic/inbounds" -Method Get
```

##### List Users for a Specific TUIC Inbound

**curl:**
```bash
curl -X GET "http://localhost:8081/tuic/inbounds/users?tag=tuic-in"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/tuic/inbounds/users?tag=tuic-in" -Method Get
```

##### Add a User to a Specific TUIC Inbound

**curl:**
```bash
curl -X POST http://localhost:8081/tuic/inbounds/users/add \
  -H "Content-Type: application/json" \
  -d '{"tag":"tuic-in","user":{"uuid":"b2c3d4e5-f6a7-5432-1098-abcdef654321","password":"inboundpass","name":"inbounduser"}}'
```

**PowerShell:**
```powershell
$data = @{
  tag = "tuic-in"
  user = @{
    uuid = "b2c3d4e5-f6a7-5432-1098-abcdef654321"
    password = "inboundpass"
    name = "inbounduser"
  }
}
$json = $data | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/tuic/inbounds/users/add" -Method Post -Body $json -ContentType "application/json"
```

##### Delete a User from a Specific TUIC Inbound

**curl:**
```bash
curl -X DELETE "http://localhost:8081/tuic/inbounds/users/delete?tag=tuic-in&uuid=b2c3d4e5-f6a7-5432-1098-abcdef654321"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/tuic/inbounds/users/delete?tag=tuic-in&uuid=b2c3d4e5-f6a7-5432-1098-abcdef654321" -Method Delete
```

## VMess User Management API

This document describes the REST API endpoints available for managing VMess users both globally and for specific inbound instances.

### API Endpoints Overview

#### Global User Management
- `GET /vmess/users` - List all VMess users in the global registry
- `POST /vmess/users` - Add a new VMess user to the global registry and all inbounds
- `DELETE /vmess/users/delete?uuid=<uuid>` - Remove a VMess user from the global registry and all inbounds

#### Inbound-specific User Management
- `GET /vmess/inbounds` - List all VMess inbound tags
- `GET /vmess/inbounds/users?tag=<tag>` - List VMess users for a specific inbound
- `POST /vmess/inbounds/users/add` - Add a VMess user to a specific inbound
- `DELETE /vmess/inbounds/users/delete?tag=<tag>&uuid=<uuid>` - Remove a VMess user from a specific inbound

### User Object Format

```json
{
  "name": "username",
  "uuid": "a1b2c3d4-e5f6-4321-8901-abcdef123456",
  "alterId": 0
}
```

### Examples

All examples assume the API is running on `localhost:8081`.

#### Global User Management

##### List All VMess Users

**curl:**
```bash
curl -X GET http://localhost:8081/vmess/users
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/vmess/users" -Method Get
```

##### Add a New VMess User

**curl:**
```bash
curl -X POST http://localhost:8081/vmess/users \
  -H "Content-Type: application/json" \
  -d '{"name":"newuser","uuid":"a1b2c3d4-e5f6-4321-8901-abcdef123456","alterId":0}'
```

**PowerShell:**
```powershell
$user = @{
  name = "newuser"
  uuid = "a1b2c3d4-e5f6-4321-8901-abcdef123456"
  alterId = 0
}
$json = $user | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/vmess/users" -Method Post -Body $json -ContentType "application/json"
```

##### Delete a VMess User

**curl:**
```bash
curl -X DELETE "http://localhost:8081/vmess/users/delete?uuid=a1b2c3d4-e5f6-4321-8901-abcdef123456"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/vmess/users/delete?uuid=a1b2c3d4-e5f6-4321-8901-abcdef123456" -Method Delete
```

#### Inbound-specific User Management

##### List All VMess Inbounds

**curl:**
```bash
curl -X GET http://localhost:8081/vmess/inbounds
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/vmess/inbounds" -Method Get
```

##### List Users for a Specific VMess Inbound

**curl:**
```bash
curl -X GET "http://localhost:8081/vmess/inbounds/users?tag=vmess-in"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/vmess/inbounds/users?tag=vmess-in" -Method Get
```

##### Add a User to a Specific VMess Inbound

**curl:**
```bash
curl -X POST http://localhost:8081/vmess/inbounds/users/add \
  -H "Content-Type: application/json" \
  -d '{"tag":"vmess-in","user":{"name":"inbounduser","uuid":"b2c3d4e5-f6a7-5432-1098-abcdef654321","alterId":0}}'
```

**PowerShell:**
```powershell
$data = @{
  tag = "vmess-in"
  user = @{
    name = "inbounduser"
    uuid = "b2c3d4e5-f6a7-5432-1098-abcdef654321"
    alterId = 0
  }
}
$json = $data | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/vmess/inbounds/users/add" -Method Post -Body $json -ContentType "application/json"
```

##### Delete a User from a Specific VMess Inbound

**curl:**
```bash
curl -X DELETE "http://localhost:8081/vmess/inbounds/users/delete?tag=vmess-in&uuid=b2c3d4e5-f6a7-5432-1098-abcdef654321"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/vmess/inbounds/users/delete?tag=vmess-in&uuid=b2c3d4e5-f6a7-5432-1098-abcdef654321" -Method Delete
```

## Common Error Responses

- **400 Bad Request**: When required parameters are missing or malformed
  
  Example for VLESS/TUIC: Missing UUID
  ```json
  "missing uuid parameter"
  ```
  
  Example for HTTP: Missing username
  ```json
  "missing username parameter"
  ```

- **404 Not Found**: When requested resource doesn't exist
  
  Example: Inbound tag not found
  ```json
  "inbound with tag not found: invalid-tag"
  ```

- **409 Conflict**: When trying to add a user that already exists
  
  Example for VLESS/TUIC: Duplicate UUID
  ```json
  "user with this UUID already exists"
  ```
  
  Example for HTTP: Duplicate username
  ```json
  "user with username already exists"
  ```

## Testing Notes

### VLESS Testing
1. UUIDs must be valid UUID format (e.g., `a1b2c3d4-e5f6-4321-8901-abcdef123456`)
2. For the `flow` field, valid values include:
   - `""`  (empty string for no flow)
   - `"xtls-rprx-vision"`
3. Each inbound is identified by its unique tag, which is defined in your configuration

### HTTP Testing
1. Username and password are both required fields when creating HTTP users
2. Password strength is not enforced by the API, but using strong passwords is recommended
3. Usernames should be unique across all HTTP inbounds

### TUIC Testing
1. UUIDs must be valid UUID format (e.g., `a1b2c3d4-e5f6-4321-8901-abcdef123456`)
2. Password is required when creating TUIC users
3. The name field is optional
4. Each UUID must be unique across all TUIC inbounds



When testing, ensure your server is properly configured with at least one VLESS, HTTP, or TUIC inbound before attempting to manage users.
<think>Looking at the provided code, I need to document the configuration file update functionality that's available in the API. Here are the key parts I need to focus on:

1. The `UpdateConfigFile` function on line ~450
2. The `updateConfigHandler` function on line ~592
3. The `getConfigHandler` function on line ~627

The configuration update endpoints are:
- POST /config/update?path=/path/to/config.json
- GET /config/get?path=/path/to/config.json

I also noticed that there's functionality to update the config file when adding/deleting users through existing endpoints - each of the handlers checks for a config_path query parameter and will update the config file if provided.

I'll document these features similar to the existing documentation format, focusing on both curl and PowerShell examples for each endpoint.</think>## Configuration File Management API

This section describes the REST API endpoints available for managing the configuration file that persists user data across program restarts.

### Configuration File Endpoints

- `POST /config/update?path=<path>` - Update the configuration file with current user registrations
- `GET /config/get?path=<path>` - Retrieve the content of the configuration file

### Configuration Update with User Operations

All user management endpoints support automatically updating the configuration file by adding a `config_path` query parameter:

- `POST /users?config_path=<path>` - Add a user and update the config file
- `DELETE /users/delete?uuid=<uuid>&config_path=<path>` - Delete a user and update the config file
- `POST /inbounds/users/add?config_path=<path>` - Add a user to an inbound and update the config file
- `DELETE /inbounds/users/delete?tag=<tag>&uuid=<uuid>&config_path=<path>` - Delete a user from an inbound and update the config file

### Examples

All examples assume the API is running on `localhost:8081`.

#### Update Configuration File

Updates the configuration file with all current user registrations from all protocols.

**curl:**
```bash
curl -X POST "http://localhost:8081/config/update?path=/path/to/config.json"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/config/update?path=c.json" -Method Post
```

#### Get Configuration File Content

Retrieve the full content of the configuration file.

**curl:**
```bash
curl -X GET "http://localhost:8081/config/get?path=/path/to/config.json"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/config/get?path=c.json" -Method Get
```

#### Add User and Update Configuration

Add a new user and automatically update the configuration file.

**curl:**
```bash
curl -X POST "http://localhost:8081/users?config_path=/path/to/config.json" \
  -H "Content-Type: application/json" \
  -d '{"name":"newuser","uuid":"a1b2c3d4-e5f6-4321-8901-abcdef123456","flow":"xtls-rprx-vision"}'
```

**PowerShell:**
```powershell
$user = @{
  name = "newuser"
  uuid = "a1b2c3d4-e5f6-4321-8901-abcdef123456"
  flow = "xtls-rprx-vision"
}
$json = $user | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/users?config_path=c.json" -Method Post -Body $json -ContentType "application/json"
```

#### Delete User and Update Configuration

Delete a user and automatically update the configuration file.

**curl:**
```bash
curl -X DELETE "http://localhost:8081/users/delete?uuid=a1b2c3d4-e5f6-4321-8901-abcdef123456&config_path=/path/to/config.json"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/users/delete?uuid=a1b2c3d4-e5f6-4321-8901-abcdef123456&config_path=c.json" -Method Delete
```

#### Add User to Inbound and Update Configuration

Add a user to a specific inbound and update the configuration file.

**curl:**
```bash
curl -X POST "http://localhost:8081/inbounds/users/add?config_path=/path/to/config.json" \
  -H "Content-Type: application/json" \
  -d '{"tag":"vless-in","user":{"name":"inbounduser","uuid":"b2c3d4e5-f6a7-5432-1098-abcdef654321","flow":"xtls-rprx-vision"}}'
```

**PowerShell:**
```powershell
$data = @{
  tag = "vless-in"
  user = @{
    name = "inbounduser"
    uuid = "b2c3d4e5-f6a7-5432-1098-abcdef654321"
    flow = "xtls-rprx-vision"
  }
}
$json = $data | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8081/inbounds/users/add?config_path=c.json" -Method Post -Body $json -ContentType "application/json"
```

#### Delete User from Inbound and Update Configuration

Delete a user from a specific inbound and update the configuration file.

**curl:**
```bash
curl -X DELETE "http://localhost:8081/inbounds/users/delete?tag=vless-in&uuid=b2c3d4e5-f6a7-5432-1098-abcdef654321&config_path=/path/to/config.json"
```

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8081/inbounds/users/delete?tag=vless-in&uuid=b2c3d4e5-f6a7-5432-1098-abcdef654321&config_path=c.json" -Method Delete
```


Note: The path parameter must be URL-encoded if it contains special characters.

