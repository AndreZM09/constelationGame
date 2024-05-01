document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener el mapa seleccionado desde el almacenamiento local
        const mapaSeleccionado = JSON.parse(localStorage.getItem('mapaSeleccionado'));
        if (mapaSeleccionado) {
            // Obtener el contexto del lienzo
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            
            // Limpiar el lienzo
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Dibujar líneas
            ctx.strokeStyle = 'white';
            mapaSeleccionado.lineas.forEach(linea => {
                ctx.beginPath();
                ctx.moveTo(linea.x1, linea.y1);
                ctx.lineTo(linea.x2, linea.y2);
                ctx.stroke();
            });

            // Dibujar puntos
            ctx.fillStyle = 'white';
            mapaSeleccionado.puntos.forEach(punto => {
                ctx.beginPath();
                ctx.arc(punto.x, punto.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        } else {
            console.error('No se ha seleccionado ningún mapa.');
        }
    } catch (error) {
        console.error('Error al obtener los nombres de los mapas:', error);
    }
});
