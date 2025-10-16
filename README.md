# TODO App - Sistema de Gestión de Tareas

## Descripción
Sistema de gestión de tareas (TODO App) desarrollado con arquitectura de microservicios, contenerizada con Docker y orquestada con Docker Compose. Permite crear, visualizar, actualizar y eliminar tareas de manera eficiente.

## Arquitectura
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   Base de       │
│   (Nginx)       │◄──►│   (Node.js)      │◄──►│   Datos         │
│   Puerto: 8080  │    │   Puerto: 3000   │    │   (PostgreSQL)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Tecnologías
- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: HTML + CSS + JavaScript + Nginx
- **Base de Datos**: PostgreSQL 15
- **Orquestación**: Docker + Docker Compose
- **Servidor Web**: Nginx (Frontend)

## Requisitos Previos
- Docker 20+
- Docker Compose 2+
- Git

## Instalación y Ejecución

### 1. Clonar repositorio
```bash
git clone https://github.com/Dogor0555/todo-app.git
cd todo-app
```

### 2. Levantar servicios
```bash
# Construir y levantar todos los servicios
docker-compose up --build

# O ejecutar en segundo plano
docker-compose up -d --build
```

### 3. Acceder a la aplicación
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## Comandos Útiles

### Docker Compose
```bash
# Construir imágenes
docker-compose build

# Levantar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Ver estado de servicios
docker-compose ps

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Desarrollo
```bash
# Entrar a contenedor del backend
docker-compose exec backend sh

# Ver base de datos PostgreSQL
docker-compose exec db psql -U postgres -d todoapp
```

## Estructura del Proyecto
```
todo-app/
├── backend/
│   ├── src/
│   │   ├── index.js          # Servidor Express
│   │   └── database.js       # Configuración PostgreSQL
│   ├── Dockerfile            # Imagen Docker del backend
│   ├── package.json          # Dependencias Node.js
│   └── .env.example          # Variables de entorno ejemplo
├── frontend/
│   ├── index.html            # Interfaz principal
│   ├── styles.css            # Estilos CSS
│   ├── app.js                # Lógica JavaScript
│   ├── Dockerfile            # Imagen Docker del frontend
│   └── nginx.conf            # Configuración Nginx
├── docker-compose.yml        # Orquestación de servicios
├── .gitignore               # Archivos ignorados por Git
└── README.md                # Documentación
```

## API Endpoints

### Health Check
- **GET** `/health`
- **Descripción**: Verifica estado del backend y base de datos
- **Response**: 
```json
{
  "status": "OK",
  "message": "Backend y base de datos funcionando correctamente",
  "timestamp": "2025-10-15T22:30:00Z",
  "database": "connected"
}
```

### Tareas

#### Obtener todas las tareas
- **GET** `/tasks`
- **Descripción**: Retorna lista de todas las tareas
- **Response**: Array de objetos task
- **Status**: 200 OK

#### Crear nueva tarea
- **POST** `/tasks`
- **Body**:
```json
{
  "title": "Nueva tarea"
}
```
- **Response**: Tarea creada
- **Status**: 201 Created

#### Actualizar tarea
- **PUT** `/tasks/:id`
- **Body**:
```json
{
  "completed": true
}
```
- **Response**: Tarea actualizada
- **Status**: 200 OK

#### Eliminar tarea
- **DELETE** `/tasks/:id`
- **Response**: Sin contenido
- **Status**: 204 No Content

## Modelo de Datos
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Funcionalidades
- ✅ Crear nuevas tareas
- ✅ Marcar tareas como completadas/pendientes
- ✅ Eliminar tareas
- ✅ Visualización en tiempo real
- ✅ Persistencia de datos
- ✅ Interfaz responsive

## Autores
- **Estudiante 1**: Marcos Bonilla - Backend & Docker
- **Estudiante 2**: Jesús Amaya - Frontend & UI

## Fecha de Entrega
15 de Octubre, 2025

## Notas Técnicas
- La base de datos se inicializa automáticamente al primer inicio
- Los datos persisten mediante volúmenes Docker
- Health checks aseguran que los servicios estén listos
- Configuración optimizada para desarrollo y producción

---
**¡La aplicación está lista para usar! 🚀**