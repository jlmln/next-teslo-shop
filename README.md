# Next.js Teslo-Shop
Para correr localmente, se necesita la base de datos
```
docker-compose up -d
```
* El -d, significa __detached__

* MongoDB URL Local:
```
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__a__.env__

## Llenar la base de datos con información de pruebas
(!Solo usar en desarrollo para pruebas, no usar en producción!)
Llamar a:
```
http://localhost:3000/api/seed