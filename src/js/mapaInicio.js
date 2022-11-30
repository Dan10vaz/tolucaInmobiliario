(function () {
    const lat = 19.2718459;
    const lng = -99.6513658;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 13);

    let markers = new L.FeatureGroup().addTo(mapa);

    let propiedades = [];

    //Filtros 
    const filtros = {
        categoria: '',
        precio: '',
        tipo: '',
    }

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');
    const tiposSelect = document.querySelector('#tipos');


    //Filtrado de categorias, precios y tipos

    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value;
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value;
        filtrarPropiedades();
    })

    tiposSelect.addEventListener('change', e => {
        filtros.tipo = +e.target.value;
        filtrarPropiedades();
    })


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            const prop = propiedades.filter(propiedades => propiedades.publicado === true)
            mostrarPropiedades(prop);
            /* console.log(prop); */

        } catch (error) {
            console.log(error);
        }
    }

    const mostrarPropiedades = propiedades => {

        //Limpiar los markers previos
        markers.clearLayers();

        propiedades.forEach(propiedad => {
            //Agregar pines a cada propiedad
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            })
                .addTo(mapa)
                .bindPopup(`
                    <p class="text-indigo-600 font-bold text-center">${propiedad.categoria.nombre} en ${propiedad.tipo.nombre}</p>
                    <h1 class=" text-xl font-extrabold uppercase my-2 text-center">${propiedad?.titulo}</h1>
                    <img src="/uploads/${propiedad?.imagenes[0].imagenes}" alt="Imagen de la propiedad ${propiedad.titulo}">
                    <p class="text-gray-600 font-bold text-center">${propiedad.precio.nombre}</p>
                    <a href="/propiedad/${propiedad.id}" class="bg-indigo-500 hover:bg-indigo-700 block py-2 text-center font-bold uppercase">Ver Propiedad</a>
                `)

            markers.addLayer(marker)
        });
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio).filter(filtrarTipo)

        /* console.log(resultado); */

        mostrarPropiedades(resultado);
    }

    // FILTRAMOS POR 3 CATEGORIAS Y SE LAS PASAMOS A NUESTRO METODO DE FILTRARPROPIEDADES()
    const filtrarCategoria = (propiedad) => {
        return filtros.categoria ? propiedad.categoriaId === filtros.categoria && propiedad.publicado === true : propiedad;
    }

    const filtrarPrecio = (precio) => {
        return filtros.precio ? precio.precioId === filtros.precio && propiedad.publicado === true : precio;
    }

    const filtrarTipo = (tipo) => {
        return filtros.tipo ? tipo.tipoId === filtros.tipo && propiedad.publicado === true : tipo;
    }

    obtenerPropiedades();
})()