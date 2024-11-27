# Endpoints de la API

## 1. Usuarios

### 1. Registro de un usuario
`POST /api/users/register(UserRegistrationData)`  
**Parámetros:** Ninguno.

**Respuesta:** IdSolidarian


### 2. Edición de los datos de registro
`PUT /api/users/{user_id}/update(UserUpdateData)`
**Parámetros:**  
- `user_id`: identificador único del usuario.


### 3. Consulta del perfil público
`GET /api/users/{username}/profile`  
**Parámetros:**  
- `username`: nombre de usuario único.

**Respuesta:** ProfilePublicData


### 4. Login de un usuario
`POST /api/users/login(LoginData)`  
**Respuesta:** Token


### 5. Logout de un usuario
`POST /api/users/logout`
