/**
 * 
 * @param {number[]} linea 
 * Funcion para calcular la distancia de las lineas para dar una puntuacion 
 * usaremos distancia euclidiana para saber la longitud de las lineas
 * en base a los puntos dados del array
 */
function puntuacion(linea){
    const x1 = linea ;// habra que acceder a las coordenadas correspondientes
    const y1 = linea ;
    const x2 = linea ;
    const y2 = linea ;
    //falta elevar al cuadrado cada termino 
    const dist=Math.sqrt((x1-x2) + (y1-y2) ); 
};