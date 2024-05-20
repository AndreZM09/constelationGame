/**
 * Clase index layaout principal del juego este se encarga de la jugabilidad 
 * @author Aldo Granillo, Andre Zurita, Ian Duran 
 * 
 */
let nodes = []; // array de los nodos (puntos)
let selectedNode = null; // indica si hay un nodo seleccionado
let arcos = []; // array de las lineas 
/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number[]} nodes 
 * @returns {(number | null)} retorna el nodo o de ser contrario null
 */
function getNodeAt(x, y, nodes) {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    const a = x - node.x;
    const b = y - node.y;

    const c = Math.sqrt(a * a + b * b);

    if (c < 6) {
      return node;
    }
  }
  return null;
}
/**
 * 
 * @param {object} contexto del canvas ctx 
 * @param {number[]} nodes 
 */
function drawNodes(ctx, nodes) {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];

    if (node === selectedNode) {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "white";
    }

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.fillStyle = "white";
    ctx.arc(node.x, node.y, 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    if (node === selectedNode) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "white";
    }

  }
}
/**
 * 
 * @param {object} ctx 
 * @param {number[]} arcos 
 */
function drawArcos(ctx, arcos) {
  for (let index = 0; index < arcos.length; index++) {
    const arco = arcos[index];
    ctx.lineWidth = 1;
    ctx.moveTo(arco.node1.x, arco.node1.y);
    ctx.lineTo(arco.node2.x, arco.node2.y);
    ctx.strokeStyle = "white";
    ctx.stroke();
  }
}
/**
 * @param {object} ctx  contexto del canvas
 * @param {number[]} linea 
 * Funcion para calcular la distancia de las lineas para dar una puntuacion 
 * usaremos distancia euclidiana para saber la longitud de las lineas
 * en base a los puntos dados del array
 */
function puntuacion(ctx, linea) {
  console.log("arco", linea)
  let dist = 0;
  for (let i = 0; i < linea.length; i++) {
    const arco = arcos[i];
    dist += Math.sqrt(Math.pow(arco.node2.x - arco.node1.x, 2) + Math.pow(arco.node2.y - arco.node1.y, 2));

  };
  ctx.font = "20px Arial";
  //ctx.fillText =("Puntuacion: "+ dist, 1280, 600);
  ctx.fillText("distancia: " + dist, 10, 30);
  ctx.fillStyle = "red"
  ctx.fill();

};
window.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // instancia del socket
  const canva = document.getElementById("canvas"); // instncia del canvas
  const ctx = canva.getContext("2d"); // contexto del canvas
  let x = 0;
  let y = 0;
  canva.style.border = "2px solid white"; // parametros de estilo del canva
  canva.addEventListener('click', (event) => { //creamos el evento del boton
    //Obtenemos coordenadas del click
    x = event.offsetX; // coordenada x
    y = event.offsetY; // coordenada y
    let tempNode = getNodeAt(x, y, nodes);

    if (selectedNode !== null && tempNode === null) {
      selectedNode = tempNode;
      tempNode = null;
    }
    if (selectedNode === null) {
      selectedNode = tempNode;
      tempNode = null;
    }
    if (selectedNode === null) {
      nodes.push({ x, y });
    }
    ctx.clearRect(0, 0, canva.width, canva.heigth);
    if (selectedNode !== null && tempNode !== null) {
      arcos.push({ node1: selectedNode, node2: tempNode });
      selectedNode = null;
      tempNode = null;
    }
    drawArcos(ctx, arcos);
    drawNodes(ctx, nodes);
    puntuacion(ctx, arcos)
    ctx.clearRect(10, 30, canva.width, canva.heigth);
    //Emitir datos al server 
    socket.emit('Dibuja_puntos', { puntos: [x, y] });
    //Emitir datos de las lineas al server
    for (let i = 0; i < arcos.length; i++) {
      x1 = arcos[i].node1.x;
      y1 = arcos[i].node1.y;
      x2 = arcos[i].node2.x;
      y2 = arcos[i].node2.y;

      socket.emit('Dibuja_lineas', { lineas: [x1, y1, x2, y2] });
      console.log("Datos emitidos")
      console.log(x1, x2, y1, y2);
    }
    const viewport = document.getElementById('wrapper');
    const zoomInButton = document.getElementById('plus');
    const zoomOutButton = document.getElementById('minus');

    let currentZoom = 1; // Track current zoom level

    zoomInButton.addEventListener('click', () => {
      currentZoom *= 1.1; // Increase zoom by 10%
      viewport.style.transform = `scale(${currentZoom})`;
    });

    zoomOutButton.addEventListener('click', () => {
      // Prevent zooming out too far (optional)
      if (currentZoom > 0.5) {
        currentZoom *= 0.9; // Decrease zoom by 10%
        viewport.style.transform = `scale(${currentZoom})`;
      }
    });
  });
  // Escuchando los datos que reenvia el servidor 
  socket.on('Dibuja_puntos', data => {
    let puntos = data.puntos;
    console.log(puntos);
    ctx.beginPath();
    ctx.arc(puntos[0], puntos[1], 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
  });
  //dibujando lineas
  //REVISAR EL MODO EN EL QUE SE RECORRE EL ARRAY
  socket.on('Dibuja_lineas', data => {
    const linea = data.lineas;
    console.log(data);
    for (let index = 0; index < linea.length; index += 2) {
      const x1 = linea[index]
      const y1 = linea[index + 1]
      const x2 = linea[index + 2]
      const y2 = linea[index + 3]
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "white";
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      console.log("Línea dibujada");
      ctx.stroke();
    }
  });

});
