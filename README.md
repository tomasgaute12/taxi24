# Taxi24

Bienvenido al repositorio de Taxi24

## Stack
 > Typescript + TypeORM + PostgreSQL + Express + Jest

## Comenzando

_Clonar Repositorio_
```
git clone https://github.com/tomasgaute12/taxi24.git
```
## Levantar el servidor

<details>
<summary>
Levantar el backend de forma local con base de datos local
</summary>

> _Necesitaras tener instalado:
 [PostgresSQL](https://www.postgresql.org/download/),
 [Node](https://nodejs.org/es/) y npm (se autoinstala junto a Node)


1. Crea un nueva base de datos para el proyecto
2. En la carpeta general del proyecto, añadir un archivo _.env_ con la siguiente estructura
```js
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME= //Tu username
DB_PASSWORD= //Tu password
DB_DATABASE= //Nombre de tu db
```
3. En la terminal, desde la carpeta del repo, ejecutar el comando `npm i` para que instalar todas las dependencias del proyecto.
4. Corre el proyecto en `npm run dev`
</details>

### Tutorial de uso

#### Crea 2 usuarios: 
```http
  POST user/
```
Example: 
```js
{
    "name":"test",
    "lastname":"lastnameTest",
    "phone":"112233",
    "email":"test@gmail.com",
    "username": "test",
    "password": "test123"
}

```

#### Crea un pasajero:
```http
  POST passenger/
```
```js
{
    "userId": //Id del usuario creado,
    "ubication": {
        "lat": -33.258975,
        "long":  -68.899387
    }
}
```
#### Crea un conductor:
```http
  POST driver/
```
```js
{
    "userId": //Id del otro usuario creado,
    "ubication": {
        "lat": -32.905429,
        "long":  -68.850787
    },
    "licenseNumber": "AA12",
    "carModel": "Chevrolet Cruze",
    "carPlateNumber": "AB222AC"
}
```
#### Crea un viaje: 
Esto creara el viaje, busca a los conductores mas cercanos en un radio de 3km  y elige al más cercano. El conductor elegido deja de estar disponible hasta finalizar el viaje
```http
  POST trip/
```
```js
{
    "passengerId": //Id del pasajero creado,
    "endLocation": {
        "lat": -33.004463,
        "long": -68.856226
    }
}
```
#### Finaliza el viaje: 
```http
  PATCH /completeTrip/:id
```
Esto generará una factura del viaje. Y volvera a activar al Conductor

#### Obtener los conductores activos
```http
  GET /getActiveDrivers
```
#### Obtener los conductores en un radio de 3 km
```http
  GET /nearbyDrivers
```
example: /driver/nearbyDrivers?lat=-32.911018&long=-68.850013

#### Actualizar ubicación del conductor

```http
  PATCH /ubication/:id
```
#### Actualizar ubicación del pasajero

```http
  PATCH /ubication/:id
```
#### Obtener los viajes activos
```http
  GET /activeTrips
```
#### Obtener pasajero por el ID
```http
  GET passenger/:id
```
#### Obtener conductor por el ID
```http
  GET driver/:id
```

## Testing

```bash
  npm run test
```
