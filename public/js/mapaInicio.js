/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const lat = 19.2718459\r\n    const lng = -99.6513658\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng], 13)\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa)\r\n\r\n    let propiedades = []\r\n    let prop = []\r\n\r\n    //Filtros\r\n    const filtros = {\r\n        categoria: '',\r\n        precio: '',\r\n        tipo: '',\r\n    }\r\n\r\n    /*  console.log('filtros', filtros) */\r\n\r\n    const categoriasSelect = document.querySelector('#categorias')\r\n    const preciosSelect = document.querySelector('#precios')\r\n    const tiposSelect = document.querySelector('#tipos')\r\n\r\n\r\n    //Filtrado de categorias, precios y tipos\r\n\r\n    categoriasSelect.addEventListener('change', (e) => {\r\n        filtros.categoria = +e.target.value\r\n        filtrarPropiedades()\r\n    })\r\n\r\n    preciosSelect.addEventListener('change', (e) => {\r\n        /* console.log('E.TARGET.VALUE', e.target.value) */\r\n        var precio = e.target.value\r\n        /* console.log('precio', precio) */\r\n        var sinSignoPesos = precio.replace('$', '')\r\n        /*   console.log('sin signo pesos', sinSignoPesos) */\r\n        var sinComa = sinSignoPesos.replace(',', '')\r\n        /*   console.log('sin coma', sinComa) */\r\n        if (sinComa) {\r\n            var sinComaDos = sinComa.replace(',', '')\r\n            /*  console.log('sin comaDos', sinComaDos) */\r\n        } /* if (sinComaDos) {\r\n            var sinMX = sinComa.replace('MX', '')\r\n            console.log('sinMx', sinMX)\r\n        } if (sinMX) {\r\n            var sinPunto = sinComa.replace('.', '')\r\n            console.log('sinPunto', sinPunto)\r\n        } */\r\n        var format = Number(sinComaDos)\r\n        /* console.log(format) */\r\n        filtros.precio = format\r\n        filtrarPropiedades()\r\n    })\r\n\r\n    tiposSelect.addEventListener('change', (e) => {\r\n        filtros.tipo = +e.target.value\r\n        console.log(filtros.tipo)\r\n        filtrarPropiedades()\r\n    })\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution:\r\n            '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n    }).addTo(mapa)\r\n\r\n    const obtenerPropiedades = async () => {\r\n        try {\r\n            const url = '/api/propiedades'\r\n            const respuesta = await fetch(url)\r\n            propiedades = await respuesta.json()\r\n            prop = propiedades.filter(\r\n                (propiedades) => propiedades.publicado === true,\r\n            )\r\n            /*  console.log('propiedades del api', prop) */\r\n            mostrarPropiedades(prop)\r\n\r\n        } catch (error) {\r\n            console.log(error)\r\n        }\r\n    }\r\n\r\n    const mostrarPropiedades = (propiedades) => {\r\n        //Limpiar los markers previos\r\n        markers.clearLayers()\r\n\r\n        propiedades.forEach((propiedad) => {\r\n\r\n            //Agregar pines a cada propiedad\r\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n                autoPan: true,\r\n            }).addTo(mapa).bindPopup(`\r\n                    <p class=\"text-indigo-600 font-bold text-center\">${propiedad.categoria.nombre} en ${propiedad.tipo.nombre}</p>\r\n                    <h1 class=\" text-xl font-extrabold uppercase my-2 text-center\">${propiedad?.titulo}</h1>\r\n                    <img src=\"/uploads/${propiedad?.imagenes[0].imagenes}\" alt=\"Imagen de la propiedad ${propiedad.titulo}\">\r\n                    <p class=\"text-gray-600 font-extrabold text-center\">${propiedad.precio}</p>\r\n                    <a href=\"/propiedad/${propiedad.id}\" class=\"bg-indigo-500 hover:bg-indigo-700 block py-2 text-center font-bold uppercase\">Ver Propiedad</a>\r\n                `)\r\n\r\n            markers.addLayer(marker)\r\n        })\r\n    }\r\n\r\n    const filtrarPropiedades = () => {\r\n        const resultado = prop\r\n            .filter(filtrarCategoria)\r\n            .filter(filtrarPrecio)\r\n            .filter(filtrarTipo)\r\n\r\n        /* console.log('resultado', resultado); */\r\n\r\n        mostrarPropiedades(resultado)\r\n    }\r\n\r\n\r\n    // FILTRAMOS POR 3 CATEGORIAS Y SE LAS PASAMOS A NUESTRO METODO DE FILTRARPROPIEDADES()\r\n    const filtrarCategoria = (propiedad) => {\r\n        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad\r\n    }\r\n\r\n    const filtrarPrecio = (propiedad) => {\r\n        /* console.log('propiedad de filtro', propiedad) */\r\n        var precio = propiedad.precio;\r\n        /*  console.log('precio de filtro', precio); */\r\n        var MX = precio.replace('MX', '');\r\n        var singno = MX.replace('$', '');\r\n        var comaUno = singno.replace(',', '');\r\n        var comaDos = comaUno.replace(',', '');\r\n        /* console.log('comaDos', comaDos); */\r\n        return filtros.precio ? comaDos <= filtros.precio : propiedad\r\n    }\r\n\r\n    const filtrarTipo = (tipo) => {\r\n        /* console.log('tipo', tipo); */\r\n        return filtros.tipo ? tipo.tipoId === filtros.tipo : tipo\r\n    }\r\n\r\n    obtenerPropiedades()\r\n})()\r\n\n\n//# sourceURL=webpack://tolucainmobiliario/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;