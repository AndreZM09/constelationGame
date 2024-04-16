document.addEventListener('DOMContentLoaded', async () => {
    try {
        //Instanciando solicitud fetch para recibir los datos del servidor
        const response = await fetch('/api/nombresMapas'); 
        if (!response.ok) { // response no pudo conectar
            throw new Error('No se pudo obtener la lista de nombres de mapas');
        }
        // instancias
        const data = await response.json(); // convertimos a JSON los parametros recibidos 
        const mapas = data.mapas; // obtenemos la lista de los mapas 

        // Obtener el contenedor donde se mostrarán los mapas
        const contenedor = document.querySelector('.contenedor');

        // Función para renderizar un mapa dado
        /**
         * 
         * @param {object} mapa 
         */
        const renderizarMapa = (mapa) => {
            let maxX = 0, maxY = 0;
            // recorriendo el objeto mapa para dibujar las coordenadas de los elementos 
            mapa.puntos.forEach(punto => {
                maxX = Math.max(maxX, punto.x);
                maxY = Math.max(maxY, punto.y);
            });
            mapa.lineas.forEach(linea => {
                maxX = Math.max(maxX, linea.x1, linea.x2);
                maxY = Math.max(maxY, linea.y1, linea.y2);
            });

            // Crear lienzo para el mapa
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth; // Agregar un pequeño margen
            canvas.height = window.innerHeight; // Agregar un pequeño margen
            canvas.style.border = "2px solid white";
            const ctx = canvas.getContext('2d');

            // Dibujar líneas   
            mapa.lineas.forEach(linea => {
                ctx.beginPath();
                ctx.lineWidth=1;
                ctx.moveTo(linea.x1, linea.y1);
                ctx.lineTo(linea.x2, linea.y2);
                ctx.strokeStyle="red";
                ctx.stroke();
            });

            // Dibujar puntos
            ctx.fillStyle = 'red';
            mapa.puntos.forEach(punto => {
                ctx.beginPath();
                ctx.arc(punto.x, punto.y, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            // Limpiar contenedor y agregar lienzo
            contenedor.innerHTML = '';
            contenedor.appendChild(canvas);

            // Mostrar el nombre del mapa en la consola
            console.log('Mapa mostrado:', mapa.nombre);
        };

        // Índice del mapa actual
        let indiceMapaActual = 0;

        // Renderizar el primer mapa al cargar la página
        renderizarMapa(mapas[indiceMapaActual]);

        // Botón de navegación izquierda
        const botonIzquierda = document.createElement('button');
        botonIzquierda.textContent = '<';
        botonIzquierda.addEventListener('click', () => {
            if (indiceMapaActual > 0) {
                indiceMapaActual--;
                renderizarMapa(mapas[indiceMapaActual]);
            }
        });

        // Botón de navegación derecha
        const botonDerecha = document.createElement('button');
        botonDerecha.textContent = '>';
        botonDerecha.addEventListener('click', () => {
            if (indiceMapaActual < mapas.length - 1) {
                indiceMapaActual++;
                renderizarMapa(mapas[indiceMapaActual]);
            }
        });

        // Agregar botones de navegación fuera del contenedor del lienzo
        document.body.insertBefore(botonIzquierda, contenedor);
        document.body.insertBefore(botonDerecha, contenedor.nextSibling);

    } catch (error) {
        console.error('Error al obtener los nombres de los mapas:', error);
    }
});
