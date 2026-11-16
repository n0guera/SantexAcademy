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
4. Copiar las variable de entorno del archivo de ejemplo al de ambiente
    ```bash
    cp .env.sample .env
   ```
5. Levantar todo con: 
   ```bash
    docker compose up
   ```

## Alternativa
Aca las instruciones para correr cada servicio por separado

### Reiniciar los datos

``` bash
docker compose down -v # Esto detiene los contenedores y elimina los volúmenes (incluido db_data)
docker compose up -d   # Esto vuelve a crear todo desde cero, ejecutando init.sql
```

### Conectarse a MySQL desde el Terminal / Consola

```bash
mysql -h 127.0.0.1 -P 3306 --user=football_api --password=password football_db
```

```bash
mysql> SHOW TABLES;
```

```bash
mysql> SELECT * FROM users;
```

```bash
mysql> exit;
```

### Inicializar API

```bash
$ npm install
```

### Compilar y correr el BackEnd

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Decisiones

### Identidad, versiones FIFA y usuarios

**Decisión:** separar la identidad estable del jugador `PlayerIdentity` de sus datos variables por edición `PlayerVersion`. Crear también una entidad `User` para las cuentas de acceso.

**Justificación:** un mismo jugador puede aparecer en varias ediciones FIFA con distinta edad, club, posición, rating y skills. Separar esos datos evita duplicar la identidad y permite consultar su evolución histórica. `User` permite implementar el login, almacenar el hash de la contraseña y proteger los endpoints mediante autenticación.

### Autenticación con JWT, bcrypt y Passport

**Decisión:** implementar autenticación mediante JWT usando Passport y `passport-jwt`. Las contraseñas se validan con `bcrypt` y un guard global protege todos los endpoints, excepto los marcados como públicos mediante `@Public()`.

**Justificación:** JWT permite autenticar peticiones sin mantener sesiones en el servidor. Passport centraliza la estrategia de autenticación y facilita validar el token Bearer en cada solicitud. `bcrypt` evita almacenar contraseñas en texto plano. El guard global asegura que los nuevos endpoints queden protegidos por defecto, cumpliendo el requisito de que ningún endpoint devuelva datos sin autenticación.