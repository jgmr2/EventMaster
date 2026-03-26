# Documentacion de API - EventMaster

## Informacion General
**Base URL:** `http://localhost:3000/api`  
**Protocolo de Autenticacion:** JSON Web Token (JWT)  
**Header Requerido:** `x-token` (o `Authorization: Bearer <token>`)

---

## Roles de Usuario
El sistema implementa un Control de Acceso Basado en Roles (RBAC):
* **admin:** Acceso total al sistema y gestion de infraestructura.
* **organizer:** Creacion y gestion de eventos, zonas y reportes de ventas.
* **artist:** Visualizacion de metricas de ventas y estado de aforo en tiempo real.
* **user:** Consulta de cartelera y gestion de reservas personales.

---
# 📋 Checklist de Implementacion - EventMaster

## 1. Modulo de Autenticacion (Auth)
- [x] **POST /auth/register**: Registro con asignacion de rol protegida (Whitelist).
- [x] **POST /auth/login**: Validacion de credenciales y retorno de JWT + Rol.
- [x] **GET /auth/me**: Recuperacion de sesion para el usuario autenticado.
- [ ] **Middleware checkRole**: Implementar la restriccion de acceso segun el rol del JWT.

## 2. Modulo de Eventos (Events)
- [x] **GET /events**: Listado general con ordenamiento por fecha.
- [x] **GET /events/:id**: Detalle tecnico, zonas y precios por ID.
- [x] **POST /events/new**: Creacion de evento y configuracion de aforo (Admin/Organizer).
- [ ] **PATCH /events/:id**: Actualizacion parcial de parametros del evento (Admin/Organizer).
- [ ] **DELETE /events/:id**: Cancelacion logica mediante cambio de estado (Admin/Organizer).

## 3. Modulo de Sedes (Places)
- [ ] **GET /places**: Listado de infraestructura registrada (Direccion/Capacidad).
- [ ] **POST /places**: Alta de nuevas sedes fisicas (Solo Admin).
- [ ] **GET /places/:id/availability**: Verificacion de disponibilidad y colisiones de horario.

## 4. Modulo de Reservas (Reservations)
- [ ] **POST /reservations**: Transaccion de compra y actualizacion automatica de cupo (User).
- [ ] **GET /reservations/my-tickets**: Historial de comprobantes del usuario activo (User).
- [ ] **GET /reservations/event/:eventId**: Reporte de ventas y disponibilidad por zona (Admin/Organizer/Artist).

## 5. Infraestructura y Calidad
- [x] **Estructura de Modelos**: User y Event definidos con validaciones.
- [x] **Seguridad Base**: Hashing de passwords y proteccion de JWT.
- [ ] **Estandarizacion de Respuestas**: Asegurar codigos 200, 201, 400, 401, 403, 404 y 500.
---

## Codigos de Respuesta
* `200 OK`: Operacion exitosa.
* `201 Created`: Recurso creado correctamente.
* `400 Bad Request`: Error en parametros de entrada o validacion de negocio.
* `401 Unauthorized`: Fallo en la autenticacion (token invalido o ausente).
* `403 Forbidden`: Privilegios insuficientes para el recurso solicitado.
* `404 Not Found`: Recurso no localizado en la base de datos.
* `500 Internal Server Error`: Error inesperado en la ejecucion del servidor.