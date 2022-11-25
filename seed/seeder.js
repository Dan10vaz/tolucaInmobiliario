import { exit } from 'node:process';
import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from './usuarios.js';
import tipos from './tipos.js';
import Tipo from '../models/Tipo.js';

import db from "../config/dataBase.js";
import { Categoria, Precio, Usuario } from "../models/index.js"

const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate();
        //Generar las columnas de la tabla
        await db.sync()
        //Insertar los datos en la tabla
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Tipo.bulkCreate(tipos),
            Usuario.bulkCreate(usuarios)
        ]);
        console.log("Datos insertados");
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

const eliminarDatos = async () => {
    try {
        await Promise.all([
            Categoria.destroy({ where: {}, truncate: true }),
            Precio.destroy({ where: {}, truncate: true }),
            Tipo.destroy({ where: {}, truncate: true })
        ]);
        console.log("Datos eliminados");
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    eliminarDatos();
}