const express = require('express')
const app = express()
const port = 3000
//Esto es del socket
const http = require('http');
const server = http.createServer(app);
const {Server}= require("socket.io")
const io = new Server(server)
const { Socket } = require('dgram');
const path = require('path');

const saveMapToDB = require('./conexion').saveMapToDB
app.use(express.static(path.resolve("")))
app.use(express.json());

io.on('connection', (socket) => {
    console.log('usuario conectado');
    socket.on('Dibuja_puntos', data=>{
        console.log(data);
        io.emit('Dibuja_puntos', data);
    });
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  
app.get('/mapmaker', (req, res) => {
    res.sendFile(path.join(__dirname, 'mapmaker.html'));
  });
app.get('/mapas', (req, res) => {
    res.sendFile(path.join(__dirname, 'mapas.html'));
});
app.post('/guardarMapa', async (req, res) => {
    try {
        await saveMapToDB(req.body);
        res.status(200).json({ mensaje: 'Mapa guardado con éxito' });
    } catch (err) {
        console.error('Error al guardar mapa:', err);
        res.status(500).json({ mensaje: 'Error al guardar el mapa' });
    }
});
//Crear la peticion para la muestra de datos en caso de ser necesario 

server.listen(port, ()=>{
    console.log(`El servidor está funcionando en http://localhost:${port}`);
})
require('./conexion');