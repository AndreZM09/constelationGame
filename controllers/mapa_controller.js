var mapaModel = require('../models/mapaSchema')

const registro_mapa = async function(req, res) {
  try {
    var data = req.body;
    var reg = await mapaModel.create(data);
    res.status(200).send({ data: reg });
  } catch (error) {
    console.error('Error al guardar el mapa:', error);
    res.status(500).send({ message: 'Error al guardar el mapa' });
  }
}

const obtenerInfoMapa = async function(req, res) {
  try {
    const mapas = await mapaModel.find({}, 'nombre');
    const nombres = mapas.map(mapa => mapa.nombre);
    res.status(200).json({ nombres });
  } catch (error) {
    console.error('Error al obtener los nombres de los mapas:', error);
    res.status(500).json({ error: 'Error al obtener los nombres de los mapas' });
  }
}
  
  module.exports = { registro_mapa, obtenerInfoMapa }; // exportamos la funcion