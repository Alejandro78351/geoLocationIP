
# Ejecución

```js
npm i 
```
```js
npm start
```
# Test

```js
npm test
```
Se agregaron test e2e  e unitarios. 

# Rutas

| Type | Route  | 'Authorization' Header required | Body
| :---: | :-: | :-: | :-: | 
| Post | localhost:8080/v1/location/blackList | N | { ip:’{ipAddress}'}
| Get | localhost:8080/v1/location/?ip={ipAddress} | N | Empty

# Consideracion

Para hacer un uso racional de las APIs:

>Todas las ips consultadas y los países se persisten en base de datos debido a que es una información poco volátil.

  

>Se implementó una caché sobre cada una de las ips que son consultadas durante el día, esta caché tiene un tiempo de expiración hasta el final del día debido a que la información de la TRM es un dato que se actualiza diariamente.

  

>Según los requerimientos funcionales de la aplicación se decidió utilizar una base de datos NOSQL debido a que no se requiere un alto nivel de atomicidad en el manejo de información.

  

>Se implementó un middleware con una expresión regular para validar el de formato de IPs en cada una de las consultas y rechazar las peticiones que no cumplen con el formato.

  

>Cuando se marca un ip para que quede en una lista negra, si la ip nunca ha sido consultada, se persiste en directamente en base de datos con un estado blacklist activo y se guarda en caché sin hacer consulta a las API externas. Si la ip ya ha sido consultada, se cambia el estado en base de datos y se actualiza en caché la información de la IP.
  
