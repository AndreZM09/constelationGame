const mongoose = require('mongoose');
var schema = mongoose.Schema

var mapaSchema = schema({
  nombre:{
    type: String,
    default: "",
  },
  puntos: [{
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  }],
  lineas: [{
    x1: {
      type: Number,
      required: true,
    },
    y1: {
      type: Number,
      required: true,
    },
    x2: {
      type: Number,
      required: true,
    },
    y2: {
      type: Number,
      required: true,
    },
  }],
});

module.exports = mongoose.model('mapa', mapaSchema);
