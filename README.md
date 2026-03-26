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

## Endpoints de Autenticacion (Auth)

| Metodo | Endpoint | Descripcion | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Registro de usuarios con asignacion de rol protegida. | Publico |
| `POST` | `/auth/login` | Validacion de credenciales y retorno de JWT. | Publico |
| `GET` | `/auth/me` | Recuperacion de datos del perfil del usuario autenticado. | Privado |

---

## Endpoints de Eventos (Events)

| Metodo | Endpoint | Descripcion | Requisito de Rol |
| :--- | :--- | :--- | :--- |
| `GET` | `/events` | Listado de eventos con ordenamiento por fecha. | Publico |
| `GET` | `/events/:id` | Obtencion de detalles, zonas y precios por ID. | Publico |
| `POST` | `/events/new` | Creacion de evento y configuracion de aforo inicial. | `admin`, `organizer` |
| `PATCH` | `/events/:id` | Modificacion parcial de parametros del evento. | `admin`, `organizer` |
| `DELETE` | `/events/:id` | Cancelacion logica del evento (cambio de estado). | `admin`, `organizer` |

---

## Endpoints de Sedes (Places)

| Metodo | Endpoint | Descripcion | Requisito de Rol |
| :--- | :--- | :--- | :--- |
| `GET` | `/places` | Listado de sedes registradas (address/capacity). | Privado |
| `POST` | `/places` | Alta de nueva infraestructura fisica. | `admin` |
| `GET` | `/places/:id/availability` | Verificacion de colisiones de horario en la sede. | `admin`, `organizer` |

---

## Endpoints de Reservas (Reservations)

| Metodo | Endpoint | Descripcion | Requisito de Rol |
| :--- | :--- | :--- | :--- |
| `POST` | `/reservations` | Transaccion de reserva y actualizacion de ocupacion. | `user` |
| `GET` | `/reservations/my-tickets` | Listado de comprobantes del usuario activo. | `user` |
| `GET` | `/reservations/event/:eventId` | Reporte tecnico de ventas y disponibilidad por zona. | `admin`, `organizer`, `artist` |

---

## Codigos de Respuesta
* `200 OK`: Operacion exitosa.
* `201 Created`: Recurso creado correctamente.
* `400 Bad Request`: Error en parametros de entrada o validacion de negocio.
* `401 Unauthorized`: Fallo en la autenticacion (token invalido o ausente).
* `403 Forbidden`: Privilegios insuficientes para el recurso solicitado.
* `404 Not Found`: Recurso no localizado en la base de datos.
* `500 Internal Server Error`: Error inesperado en la ejecucion del servidor.