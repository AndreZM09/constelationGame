var express = require('express')
const { registro_mapa, obtenerInfoMapa } = require('../controllers/mapa_controller')


var api = express.Router()

api.post('/guardarMapa', registro_mapa)
api.get('/nombresMapas', obtenerInfoMapa)

module.exports = api;