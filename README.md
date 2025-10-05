# Backend - Sistema de Gestión EcoEst

API RESTful desarrollada con Node.js, Express y TypeScript para el sistema de gestión de residuos EcoEst.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (v16 o superior)
- [Docker](https://www.docker.com/) y Docker Compose
- [Git](https://git-scm.com/)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone git@github.com:RONAL545/back.git
cd back
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Configuración de la Base de Datos PostgreSQL
DB_USER=ecoest_user
DB_PASSWORD=123457
DB_HOST=localhost
DB_PORT=5433
DB_NAME=ecoest_db

# Clave secreta para JWT (cambia esto en producción)
JWT_SECRET=tu_secreto_jwt_aqui
```

### 4. Iniciar la base de datos con Docker

```bash
docker-compose up -d
```

Este comando levantará un contenedor de PostgreSQL en el puerto `5433` con las credenciales configuradas.

### 5. Ejecutar el script SQL

Conéctate a la base de datos PostgreSQL y ejecuta el archivo `sql/codigo.sql` que contiene todas las tablas, funciones y procedimientos necesarios:

**Opción 1: Usando psql**
```bash
psql -h localhost -p 5433 -U ecoest_user -d ecoest_db -f sql/codigo.sql
```

**Opción 2: Usando un cliente GUI como pgAdmin o DBeaver**
1. Conecta a la base de datos con las credenciales del `.env`
2. Abre y ejecuta el archivo `sql/codigo.sql`

### 6. Compilar el proyecto

```bash
npm run build
```

### 7. Iniciar el servidor

**Modo producción:**
```bash
npm start
```

**Modo desarrollo (con hot-reload):**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
back/
├── src/
│   ├── config/
│   │   └── database.ts          # Configuración de conexión a PostgreSQL
│   ├── modules/
│   │   ├── auth/                # Módulo de autenticación
│   │   ├── usuarios/            # Módulo de gestión de usuarios
│   │   ├── personal/            # Módulo de personal
│   │   ├── voluntarios/         # Módulo de voluntarios
│   │   ├── listado_usuarios/    # Módulo de listado de usuarios
│   │   ├── segregacion/         # Módulo de segregación de residuos
│   │   └── reportes/            # Módulo de reportes
│   ├── routes/
│   │   └── index.ts             # Registro de rutas principales
│   └── index.ts                 # Punto de entrada de la aplicación
├── sql/
│   └── codigo.sql               # Script SQL con toda la estructura de BD
├── docker-compose.yml           # Configuración de Docker para PostgreSQL
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración de TypeScript
└── README.md                    # Este archivo
```

## 🔌 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `PUT /api/usuarios/reset-password/:usuario` - Resetear contraseña
- `DELETE /api/usuarios/:id` - Eliminar usuario (lógico)

### Personal
- `GET /api/personal` - Listar todo el personal
- `POST /api/personal/registrar` - Registrar nuevo personal

### Voluntarios
- `GET /api/voluntarios` - Listar todos los voluntarios
- `POST /api/voluntarios/registrar` - Registrar nuevo voluntario

### Listado de Usuarios
- `GET /api/listado_usuarios` - Obtener listado completo de usuarios (esto solo es una sugerencia, si lo necesitas me pides @Fernan || @Alvis)
- `GET /api/listado_usuarios/:perfil` - Obtener usuarios por perfil (esto solo es una sugerencia, si lo necesitas me pides @Fernan || @Alvis)

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **TypeScript** - Lenguaje de programación
- **PostgreSQL** - Base de datos
- **Docker** - Contenedorización
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas

## 🔧 Scripts Disponibles

- `npm run build` - Compila el proyecto TypeScript a JavaScript
- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `npm test` - Ejecuta las pruebas (por implementar)

## 🐳 Comandos Docker Útiles

```bash
# Iniciar los contenedores
docker-compose up -d

# Detener los contenedores
docker-compose down

# Ver logs del contenedor
docker-compose logs -f postgres_db

# Reiniciar el contenedor
docker-compose restart postgres_db

# Eliminar contenedores y volúmenes
docker-compose down -v
```

## 📝 Notas Importantes

1. **Base de Datos**: Asegúrate de ejecutar el archivo `sql/codigo.sql` después de levantar el contenedor de PostgreSQL.

2. **Puerto**: El servidor corre en el puerto `3000` y PostgreSQL en el puerto `5433` del host.

3. **JWT Secret**: Cambia la variable `JWT_SECRET` en producción por una clave segura.

4. **Compilación**: Cada vez que modifiques archivos TypeScript en `src/`, debes ejecutar `npm run build` o usar `npm run dev` para compilación automática.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 👤 Autor

RONAL545
