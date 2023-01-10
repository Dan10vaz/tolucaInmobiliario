(function () {
    const lat = 19.2718459
    const lng = -99.6513658
    const mapa = L.map('mapa-inicio').setView([lat, lng], 13)

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = []
    let prop = []

    //Filtros
    const filtros = {
        categoria: '',
        precio: '',
        tipo: '',
    }

    /*  console.log('filtros', filtros) */

    const categoriasSelect = document.querySelector('#categorias')
    const preciosSelect = document.querySelector('#precios')
    const tiposSelect = document.querySelector('#tipos')


    //Filtrado de categorias, precios y tipos

    categoriasSelect.addEventListener('change', (e) => {
        filtros.categoria = +e.target.value
        filtrarPropiedades()
    })

    preciosSelect.addEventListener('change', (e) => {
        /* console.log('E.TARGET.VALUE', e.target.value) */
        var precio = e.target.value
        /* console.log('precio', precio) */
        var sinSignoPesos = precio.replace('$', '')
        /*   console.log('sin signo pesos', sinSignoPesos) */
        var sinComa = sinSignoPesos.replace(',', '')
        /*   console.log('sin coma', sinComa) */
        if (sinComa) {
            var sinComaDos = sinComa.replace(',', '')
            /*  console.log('sin comaDos', sinComaDos) */
        } /* if (sinComaDos) {
            var sinMX = sinComa.replace('MX', '')
            console.log('sinMx', sinMX)
        } if (sinMX) {
            var sinPunto = sinComa.replace('.', '')
            console.log('sinPunto', sinPunto)
        } */
        var format = Number(sinComaDos)
        /* console.log(format) */
        filtros.precio = format
        filtrarPropiedades()
    })

    tiposSelect.addEventListener('change', (e) => {
        filtros.tipo = +e.target.value
        console.log(filtros.tipo)
        filtrarPropiedades()
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapa)

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            prop = propiedades.filter(
                (propiedades) => propiedades.publicado === true,
            )
            /*  console.log('propiedades del api', prop) */
            mostrarPropiedades(prop)

        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = (propiedades) => {
        //Limpiar los markers previos
        markers.clearLayers()

        propiedades.forEach((propiedad) => {

            //Agregar pines a cada propiedad
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true,
            }).addTo(mapa).bindPopup(`
                    <p class="text-indigo-600 font-bold text-center">${propiedad.categoria.nombre} en ${propiedad.tipo.nombre}</p>
                    <h1 class=" text-xl font-extrabold uppercase my-2 text-center">${propiedad?.titulo}</h1>
                    <img src="/uploads/${propiedad?.imagenes[0].imagenes}" alt="Imagen de la propiedad ${propiedad.titulo}">
                    <p class="text-gray-600 font-extrabold text-center">${propiedad.precio}</p>
                    <a href="/propiedad/${propiedad.id}" class="bg-indigo-500 hover:bg-indigo-700 block py-2 text-center font-bold uppercase">Ver Propiedad</a>
                `)

            markers.addLayer(marker)
        })
    }

    const filtrarPropiedades = () => {
        const resultado = prop
            .filter(filtrarCategoria)
            .filter(filtrarPrecio)
            .filter(filtrarTipo)

        /* console.log('resultado', resultado); */

        mostrarPropiedades(resultado)
    }


    // FILTRAMOS POR 3 CATEGORIAS Y SE LAS PASAMOS A NUESTRO METODO DE FILTRARPROPIEDADES()
    const filtrarCategoria = (propiedad) => {
        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    }

    const filtrarPrecio = (propiedad) => {
        /* console.log('propiedad de filtro', propiedad) */
        var precio = propiedad.precio;
        /*  console.log('precio de filtro', precio); */
        var MX = precio.replace('MX', '');
        var singno = MX.replace('$', '');
        var comaUno = singno.replace(',', '');
        var comaDos = comaUno.replace(',', '');
        /* console.log('comaDos', comaDos); */
        return filtros.precio ? comaDos <= filtros.precio : propiedad
    }

    const filtrarTipo = (tipo) => {
        /* console.log('tipo', tipo); */
        return filtros.tipo ? tipo.tipoId === filtros.tipo : tipo
    }

    obtenerPropiedades()
})()
