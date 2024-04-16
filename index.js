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
    ctx.lineWidth=1;
    ctx.moveTo(arco.node1.x, arco.node1.y);
    ctx.lineTo(arco.node2.x, arco.node2.y);
    ctx.strokeStyle = "white";
    ctx.stroke();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // instancia del socket
  const canva = document.getElementById("canvas"); // instncia del canvas
  const ctx = canva.getContext("2d"); // contexto del canvas

  canva.style.border = "2px solid white"; // parametros de estilo del canva
  canva.addEventListener('click',(event)=>{ //creamos el evento del boton
    //Obtenemos coordenadas del click
    let x = event.offsetX; // coordenada x
    let y = event.offsetY; // coordenada y
    //Dibujamos el circulo
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
     //Emitir datos al server 
    socket.emit('Dibuja_puntos', {puntos: [x , y]});
  
  });
  // Escuchando los datos que reenvia el servidor 
  socket.on('Dibuja_puntos', data =>{
    let puntos =data.puntos;
    console.log(puntos);
    ctx.beginPath();
    ctx.arc(puntos[0], puntos[1], 2,0,2*Math.PI );
    ctx.fillStyle = "white";
    ctx.fill();
  });
});
  