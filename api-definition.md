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


##  Administrador Comunidad
### 1. Aceptar unión de usuario a la comunidad
`POST /api/communities/{community_id}/members/{user_id}/approve`
**Parámetros:**  
- `community_id`: Identificador único de la comunidad.
- `user_id`: identificador único del usuario.

### 2. Revisar historial de un candidato o miembro
`GET /api/communities/{community_id}/members/{user_id}/history`
**Parámetros:**  
- `community_id`: Identificador único de la comunidad.
- `user_id`: Identificador único del usuario.
**Respuesta:** Historial de acciones del miembro.

### 3. Definir causa solidaria
`POST /api/communities/{community_id}/causes`
**Parámetros:**  
- `community_id`: Identificador único de la comunidad.
**Respuesta:** causeId

### 4. Definir acción solidaria
`POST /api/communities/{community_id}/actions`
**Parámetros:**  
- `community_id`: Identificador único de la comunidad.
**Respuesta:** actionId

### 4. Ver informe de la comunidad
`GET /api/communities/{community_id}/report`
**Parámetros:**  
- `community_id`: Identificador único de la comunidad.
**Respuesta:** Un informe detallado de la comunidad

##  Administrador Plataforma
### 1. Validar creación de una comunidad
`PUT /api/platform/communities/{community_id}/validate`
**Parámetros:**
- `community_id`: Identificador único de la comunidad.

### 2.Ver estadísticas generales de la plataforma
`GET /api/platform/statistics`
**Respuesta:** Un resumen estadístico general de la plataforma, 
