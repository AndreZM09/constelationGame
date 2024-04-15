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

var mongoose = require('mongoose')
var mapaRuta = require('./routes/mapas')

app.use(express.static(path.resolve("")))
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/datosMapa')
    .then(() => console.log('Conexión a la base de datos establecida'))
    .catch((err) => console.error('Error al conectar a la base de datos:', err));

server.listen(port, ()=>{
    console.log(`El servidor está funcionando en http://localhost:${port}`);
})

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

app.use('/api', mapaRuta)
