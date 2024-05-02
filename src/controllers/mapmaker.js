let nodes = []; // array de los nodos (puntos)
let selectedNode = null; // indica si hay un nodo seleccionado
let arcos = [];// array de las lineas 
// objeto mapa  que almacena los parametros de los mapas nombre, puntos y lineas 
const mapa = {
    nombre: [],
    puntos: [
      {
        x: 10,
        y: 20
      },
      {
        x: 50,
        y: 100
      }
    ],
    lineas: [
      {
        x1: 10,
        y1: 20,
        x2: 50,
        y2: 100
      }
    ]
  };
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
    ctx.arc(node.x, node.y, 1, 0, 2 * Math.PI);
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

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById("canvas");// instncia del canvas
  const context = canvas.getContext("2d");// contexto del canvas

  canvas.style.border = "2px solid white";// parametros de estilo del canva
  //Evento para crear y conectar puntoa con lineas
  canvas.addEventListener("click", (e) => {
    // instanciando coordenadas x, y  
    let x = e.clientX - canvas.offsetLeft; 
    let y = e.clientY - canvas.offsetTop;

    let tempNode = getNodeAt(x, y, nodes);// definimos un node temporal
    
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
  
    context.clearRect(0, 0, canvas.width, canvas.height); // limpiamos el canvas
  
    if (selectedNode !== null && tempNode !== null) {
        arcos.push({ node1: selectedNode, node2: tempNode });
        selectedNode = null;
        tempNode = null;
    }
    // pasamos parametros a las funciones definidas
    drawArcos(context, arcos);
    drawNodes(context, nodes);
      
  });
  //Eveneto para guardar nombre 
    const btn_nombre=document.getElementById('nombre');
    btn_nombre.addEventListener('click', ()=>{
        let mapname=document.getElementById('name_map').value; // extraemos los valores almacenados en el elemento html
        if(mapname.trim()!=""){
            mapa.nombre = mapname;
            alert("Nombre guardado")
        }else{
            alert("Ingrese un nombre");
        }
    });
    //Evento para guardar el mapa 
    const btn_guarda=document.getElementById('guardar');
    btn_guarda.addEventListener('click', async()=>{
      // Obtener datos de nodos y conexiones
      const puntos = [];
      const lineas = [];
      for (let i = 0; i < nodes.length; i++) {
        puntos.push({
          x: nodes[i].x,
          y: nodes[i].y,
        });
      }
      for (let i = 0; i < arcos.length; i++) {
        lineas.push({
          x1: arcos[i].node1.x,
          y1: arcos[i].node1.y,
          x2: arcos[i].node2.x,
          y2: arcos[i].node2.y,
        });
      }

      mapa.puntos = puntos;
      mapa.lineas = lineas;

      const mapname = document.getElementById('name_map').value;
      if (mapname.trim() !== "") {
        mapa.nombre = mapname; // se guarda el nombre en el mapa
      } else {
        alert("Ingrese un nombre");
        return; // Salir de la función si no se proporciona un nombre
      }

      console.log(mapa.nombre);
      console.log(mapa.lineas);
      console.log(mapa.puntos);
      
      // escibe el nombre del mapa y un objeto con puntos y líneas como entrada y luego guarda la informacion en la base de datos
      try {
        const respuesta = await fetch('/api/guardarMapa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mapa),
        });
        console.log(await respuesta.json()); // Mensaje de éxito o error
        alert('Mapa guardado');
      } catch (error) {
        console.error('Error al guardar mapa:', error);
      }
      
      // console.log(mapa)
      alert('diste click al boton guardar');
    });

    // Evento para borrar el canva
    const btnDelet=document.getElementById('borrar');
    btnDelet.addEventListener('click', ()=>{
        context.clearRect(0, 0, canvas.width, canvas.height);
    });
  
});
