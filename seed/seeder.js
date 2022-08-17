import { exit } from 'node:process';
import categorias from "./categorias.js";
import precios from "./precios.js";
import tipos from './tipos.js';
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";
import Tipo from '../models/Tipo.js';
import db from "../config/dataBase.js";

const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate();
        //Generar las columnas de la tabla
        await db.sync()
        //Insertar los datos en la tabla
        await Categoria.bulkCreate(categorias);
        await Precio.bulkCreate(precios);
        await Tipo.bulkCreate(tipos);
        console.log("Datos insertados");
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}