const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

console.log(process.env);

// Crear servidor de Express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio publico
app.use( express.static('public')); // funcione que se ejecuta siempre



// Lectura y parseo del body
app.use( express.json() );



// Rutas
// auth:  crear login, renew
app.use('/api/auth', require('./routes/auth'));
// CRUD: eventos
app.use('/api/events', require('./routes/events'));

//TODO Escuchar Peticiciones
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor Corriendo en puerto  ${process.env.PORT}` )
})





