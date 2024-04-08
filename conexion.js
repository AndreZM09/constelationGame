const mongoose = require('mongoose');
const datapath = 'mongodb://localhost:27017/datosMapa';
//Conexion
(async () => {
  try {
    await mongoose.connect(datapath);
    console.log('¡Conectado a la base de datos con éxito!');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
})();
//  guarda el mapa en la bd
async function saveMapToDB(mapa) {
  const MapaModel = mongoose.model('Mapa', require('./mapaSchema'));
  try {
    const nuevoMapa = new MapaModel(mapa);
    await nuevoMapa.save();
    console.log('¡Mapa guardado con éxito!');
  } catch (err) {
    console.error('Error al guardar el mapa:', err);
    throw err; // No se puede usar res aquí, así que simplemente lanzamos el error
  }
}
  
  module.exports = { saveMapToDB }; // exportamos la funcion