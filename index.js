let nodes = [];
let selectedNode = null;
let arcos = [];

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

function drawArcos(ctx, arcos) {
  for (let index = 0; index < arcos.length; index++) {
    const arco = arcos[index];
    ctx.moveTo(arco.node1.x, arco.node1.y);
    ctx.lineTo(arco.node2.x, arco.node2.y);
    ctx.strokeStyle = "white";
    ctx.stroke();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // instancia del socket
  const canva = document.getElementById("canvas");
  const ctx = canva.getContext("2d");
  canva.style.border = "2px solid white";
  canva.addEventListener('click',(event)=>{ //creamos el evento del boton
    //Obtenemos coordenadas del click
    let x = event.offsetX;
    let y = event.offsetY;
    //Dibujamos el circulo
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
     //Emitir datos al server 
    socket.emit('Dibuja_puntos', {puntos: [x , y]});
  
  });
  socket.on('Dibuja_puntos', data =>{
    let puntos =data.puntos;
    console.log(puntos);
    ctx.beginPath();
    ctx.arc(puntos[0], puntos[1], 2,0,2*Math.PI );
    ctx.fillStyle = "white";
    ctx.fill();
  });
});
  