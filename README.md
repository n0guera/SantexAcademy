# Santex Academy - FootballAPI

## Pasos para correr

1. Instalar Docker Desktop: Si no lo tienen, es el primer paso.
2. Clonar tu repositorio: 
   
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   ```
3. Navegar a la carpeta del proyecto:
    ```bash
    cd football-api
   ```
4. Copiar las variables de entorno del archivo de ejemplo al archivo de ambiente:
   ```bash
   cp .env.sample .env
   ```
   En Windows PowerShell también puede usarse:
   ```powershell
   Copy-Item .env.sample .env
   ```
5. Levantar todo desde la carpeta `football-api`:
   ```bash
   docker compose up -d --build
   ```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:4200 |
| API | http://localhost:3000 |

Usuario de prueba:

```text
Email: usuario@prueba.com
Password: prueba123
```

Para ver los logs de los contenedores:

```bash
docker compose logs -f
```

Para detener los contenedores sin eliminar los datos:

```bash
docker compose down
```

## Alternativa: ejecutar sin Docker

Para ejecutar la aplicación localmente, se necesita tener:

- Node.js y npm.
- Angular CLI instalado por npm o disponible mediante `npx`.
- MySQL activo en Laragon, XAMPP u otra instalación local.
- Una base de datos llamada `football_db`.

### 1. Configurar el backend

Desde la carpeta `football-api`, copiar el archivo de entorno a `backend/`:

```bash
cp .env.sample backend/.env
```

En Windows PowerShell:

```powershell
Copy-Item .env.sample backend/.env
```

Luego editar `backend/.env` con los datos de MySQL local. Si Laragon usa el usuario `root` sin contraseña:

```env
MYSQL_ROOT_PASSWORD=root

DB_HOST=localhost
DB_PORT=3306
DB_NAME=football_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=claveSecretaQueSoloElServerConoce
JWT_EXPIRES_IN=1h
```

`DB_PASSWORD=` se usa cuando MySQL no tiene contraseña. Si el usuario local tiene contraseña, escribirla después del igual.

Para cargar el dataset y el usuario de prueba por primera vez, importar [`docker/db/init.sql`](football-api/docker/db/init.sql) en la base `football_db` mediante phpMyAdmin o la consola de MySQL. Luego ejecutar:

```bash
cd backend
npm install
npm run start:dev
```

El backend quedará disponible en `http://localhost:3000`.

### 2. Configurar el frontend

El frontend no necesita copiar el `.env`. Las solicitudes apuntan directamente a `http://localhost:3000/api`, por lo que el backend debe ejecutarse en ese puerto.

Desde otra terminal, ubicada en la raíz de `football-api`:

```bash
cd frontend
npm install
npm start -- --host 0.0.0.0
```

El frontend quedará disponible en `http://localhost:4200`.

Usuario de prueba:

```text
Email: usuario@prueba.com
Password: prueba123
```

### Conectarse a MySQL sin Docker

Para una configuración local con usuario `root` y sin contraseña:

```bash
mysql -h 127.0.0.1 -P 3306 --user=root football_db
```

Luego:

```bash
mysql> SHOW TABLES;
mysql> SELECT * FROM users;
mysql> exit;
```

## Decisiones

### Identidad, versiones FIFA y usuarios

**Decisión:** separar la identidad estable del jugador `PlayerIdentity` de sus datos variables por edición `PlayerVersion`. Crear también una entidad `User` para las cuentas de acceso.

**Justificación:** un mismo jugador puede aparecer en varias ediciones FIFA con distinta edad, club, posición, rating y skills. Separar esos datos evita duplicar la identidad y permite consultar su evolución histórica. `User` permite implementar el login, almacenar el hash de la contraseña y proteger los endpoints mediante autenticación.

### Autenticación con JWT, bcrypt y Passport

**Decisión:** implementar autenticación mediante JWT usando Passport y `passport-jwt`. Las contraseñas se validan con `bcrypt` y un guard global protege todos los endpoints, excepto los marcados como públicos mediante `@Public()`.

**Justificación:** JWT permite autenticar peticiones sin mantener sesiones en el servidor. Passport centraliza la estrategia de autenticación y facilita validar el token Bearer en cada solicitud. `bcrypt` evita almacenar contraseñas en texto plano. El guard global asegura que los nuevos endpoints queden protegidos por defecto, cumpliendo el requisito de que ningún endpoint devuelva datos sin autenticación.

### Registro de usuarios

**Decisión:** crear usuarios mediante `POST /api/auth/register`. El endpoint valida el email y la contraseña, verifica que el email no exista, genera un hash con bcrypt y guarda el usuario en MySQL. Luego devuelve un JWT para iniciar la sesión automáticamente.

**Justificación:** bcrypt evita almacenar contraseñas en texto plano y JWT permite autenticar las siguientes solicitudes.

### Consulta, creación y edición de jugadores

**Decisión:** DTOs de validación para consulta, creación y edición de jugadores.

**Justificación:** Los DTOs separan los datos que recibe la API de las entidades internas y permiten validar las solicitudes antes de consultar o modificar la base. También ayudan a evitar campos no permitidos, validar rangos de rating y skills, y diferenciar claramente una consulta paginada de la creación o actualización parcial de un jugador.

### Listado paginado y filtrado en el servidor

**Decisión:** Implementar el listado paginado y filtrado en el servidor.

**Justificación:** El backend ya posee el dataset plano y los filtros más costosos deben ejecutarse antes de enviar datos al navegador. Paginación y filtrado con Sequelize reducen la carga de memoria y transferencia, permiten reutilizar la consulta y preparan el listado para la exportación CSV posterior.

### Exportacion CSV

**Decisión:** Generar el CSV directamente en el backend reutilizando la consulta filtrada del listado.

**Justificación:** Esto evita duplicar la lógica de filtros entre frontend y backend y garantiza que la exportación coincida con los resultados mostrados. El límite de 10.000 filas evita cargas excesivas y mantiene la solución simple, sin agregar otra dependencia.

### Frontend con Bootstrap y usuario de prueba

**Decisión:** implementar el primer flujo del frontend con componentes de Angular, Reactive Forms, Bootstrap y un tema oscuro con acentos azules. El login usa el usuario seed `usuario@prueba.com` con contraseña `prueba123`, y luego redirige al listado protegido de jugadores.

**Justificación:** Bootstrap es la herramienta visual trabajada en el curso y permite resolver una interfaz simple, sin agregar una librería de componentes compleja. El interceptor agrega el JWT a las solicitudes, mientras que el guard mejora la navegación, la protección real continúa estando en el guard global del backend. El usuario test permite probar el flujo desde cero sin depender de un registro manual.