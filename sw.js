const agregarRecursosACache = async (recursos) => {

    const cache = await caches.open('v1');
    await cache.addAll(recursos);

};

const ponerEnCache = async (solicitud, respuesta) => {

    const cache = await caches.open('v1');
    await cache.put(solicitud, respuesta);

}

const cachePrimero = async ({ solicitud, promesaRespuestaPrecargada, urlAlternativa }) => {

    // Primero intentar obtener el recurso desde la cache:
    const respuestaDesdeCache = await caches.match(solicitud);

    if (respuestaDesdeCache) {

        return respuestaDesdeCache;
    }


    // A continuación, intentar usar la respuesta precargada, si está ahí.
    // NOTA: Chrome lanza errores relativos a la respuesta precargada, consulta:
    // https://bug.chromium.org/p/chromium/issues/detail?id=1420515
    // https://github.com/mdn/dom-examples/issues/145
    // Para evitar esos errores, elimina o comenta este bloque de código
    // 'respuestaPrecargada' junto con la función 'habilitarNavegaciónPrecargada'
    // y el oyente "activate".
    const respuestaPrecargada = await promesaRespuestaPrecargada;

    if (respuestaPrecargada) {

        console.log('Usando respuesta precargada', respuestaPrecargada);
        ponerEnCache(solicitud, respuestaPrecargada.clone());
        return respuestaPrecargada;
    }

    // Después intentar obtener el recurso desde la red:
    try {

        const respuestaDesdeLaRed = await fetch(solicitud.clone());
        // La respuesta podría usarse solo una vez.
        // Tenemos que guardar el clon para poner una copia en cache
        // y servir la segunda.
        ponerEnCache(solicitud, respuestaDesdeLaRed.clone());
        return respuestaDesdeLaRed;
    } catch (error) {

        const respuestaAlternativa = await caches.match(urlAlternativa);

        if (respuestaAlternativa) {

            return respuestaAlternativa;
        }

        // Cuando incluso la respuesta alternativa no esté disponible,
        // no hay nada que podamos hacer, pero siempre debemos
        // devolver un objeto 'Response'.
        return new Response('Ha tenido lugar un error de red.', {

            status: 408,
            headers: { 'Content-Type': 'text/plain' },

        });

    }

};

const habilitarNavegaciónPrecargada = async () => {

    if (self.registration.navigationPreload) {
        // Habilitar precargas de navegación:
        await self.registration.navigationPreload.enable();
    }


};

self.addEventListener('activate', (event) => {

    event.waitUntil(enableNavigationPreload());

});

self.addEventListener('install', (event) => {

    event.waitUntil(

        agregarRecursosACache([

            './',
            './index.html',
            './formulario_datos.html',
            './tabla_datos.html',

            './css/index.css',
            './css/index_movil_vertical.css',
            './css/tabla_informe.css',
            './css/tabla_datos_movil_vertical.css',
            './css/formulario_datos.css',
            './css/formulario_datos_movil_vertical.css',
            './css/mens-emergente.css',

            './js/inicio.js',
            './js/manejo_idb.mjs',
            './js/formulario_datos.js',
            './js/tabla_datos.js',
            './js/mi_mensaje_emergente.js',

            './recursos/img/cruz_sanitaria.webp',
            './recursos/img/icono.png',
            './recursos/img/Enfermera_Datos.webp',
            './recursos/img/Enfermera_Datos_Precau.webp',
            './recursos/img/Enfermera_Datos_Peligro.webp',
            './recursos/img/Enfermera_formulario.webp',

            './recursos/snd/ok.wav',
            './recursos/snd/eliminar.wav',
            './recursos/snd/impresora.wav',
        ])

    );

});


self.addEventListener('fetch', (event) => {

    event.respondWith(

        cachePrimero({

            solicitud: event.request,
            promesaRespuestaPrecargada: event.preloadResponse,
            urlAlternativa: './recursos/img/doctora.png',

        })


    );

});
