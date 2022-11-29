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

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const lat = 19.2718459;\r\n    const lng = -99.6513658;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng], 13);\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa);\r\n\r\n    let propiedades = [];\r\n\r\n    //Filtros \r\n    const filtros = {\r\n        categoria: '',\r\n        precio: '',\r\n        tipo: '',\r\n    }\r\n\r\n    const categoriasSelect = document.querySelector('#categorias');\r\n    const preciosSelect = document.querySelector('#precios');\r\n    const tiposSelect = document.querySelector('#tipos');\r\n\r\n\r\n    //Filtrado de categorias, precios y tipos\r\n\r\n    categoriasSelect.addEventListener('change', e => {\r\n        filtros.categoria = +e.target.value;\r\n        filtrarPropiedades();\r\n    })\r\n\r\n    preciosSelect.addEventListener('change', e => {\r\n        filtros.precio = +e.target.value;\r\n        filtrarPropiedades();\r\n    })\r\n\r\n    tiposSelect.addEventListener('change', e => {\r\n        filtros.tipo = +e.target.value;\r\n        filtrarPropiedades();\r\n    })\r\n\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    const obtenerPropiedades = async () => {\r\n        try {\r\n            const url = '/api/propiedades'\r\n            const respuesta = await fetch(url)\r\n            propiedades = await respuesta.json()\r\n            const prop = propiedades.filter(propiedades => propiedades.publicado === true)\r\n            mostrarPropiedades(prop);\r\n            console.log(prop);\r\n\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n\r\n    const mostrarPropiedades = propiedades => {\r\n\r\n        //Limpiar los markers previos\r\n        markers.clearLayers();\r\n\r\n        propiedades.forEach(propiedad => {\r\n            //Agregar pines a cada propiedad\r\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n                autoPan: true\r\n            })\r\n                .addTo(mapa)\r\n                .bindPopup(`\r\n                    <p class=\"text-indigo-600 font-bold text-center\">${propiedad.categoria.nombre} en ${propiedad.tipo.nombre}</p>\r\n                    <h1 class=\" text-xl font-extrabold uppercase my-2 text-center\">${propiedad?.titulo}</h1>\r\n                    <img src=\"/uploads/${propiedad?.imagenes[0].imagenes}\" alt=\"Imagen de la propiedad ${propiedad.titulo}\">\r\n                    <p class=\"text-gray-600 font-bold text-center\">${propiedad.precio.nombre}</p>\r\n                    <a href=\"/propiedad/${propiedad.id}\" class=\"bg-indigo-500 hover:bg-indigo-700 block py-2 text-center font-bold uppercase\">Ver Propiedad</a>\r\n                `)\r\n\r\n            markers.addLayer(marker)\r\n        });\r\n    }\r\n\r\n    const filtrarPropiedades = () => {\r\n        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio).filter(filtrarTipo)\r\n\r\n        /* console.log(resultado); */\r\n\r\n        mostrarPropiedades(resultado);\r\n    }\r\n\r\n    // FILTRAMOS POR 3 CATEGORIAS Y SE LAS PASAMOS A NUESTRO METODO DE FILTRARPROPIEDADES()\r\n    const filtrarCategoria = (propiedad) => {\r\n        return filtros.categoria ? propiedad.categoriaId === filtros.categoria && propiedad.publicado === true : propiedad;\r\n    }\r\n\r\n    const filtrarPrecio = (precio) => {\r\n        return filtros.precio ? precio.precioId === filtros.precio && propiedad.publicado === true : precio;\r\n    }\r\n\r\n    const filtrarTipo = (tipo) => {\r\n        return filtros.tipo ? tipo.tipoId === filtros.tipo && propiedad.publicado === true : tipo;\r\n    }\r\n\r\n    obtenerPropiedades();\r\n})()\n\n//# sourceURL=webpack://tolucainmobiliario/./src/js/mapaInicio.js?");

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