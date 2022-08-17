import { validationResult } from 'express-validator';
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";
import Tipo from "../models/Tipo.js";

//Renderisa la vista de propiedades de un usuario
const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        barra: true
    });
}

//Formulario de creación de propiedades
const crear = async (req, res) => {
    //consultar las categorias, precios y los tipos de propiedades
    const [categorias, precios, tipos] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
        Tipo.findAll()
    ]);

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        barra: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        tipos
    });
}

const guardar = async (req, res) => {

    //validacion 
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        //consultar las categorias, precios y los tipos de propiedades
        const [categorias, precios, tipos] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll(),
            Tipo.findAll()
        ]);

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            barra: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            tipos,
            errores: resultado.array()
        })
    }
}

export {
    admin,
    crear,
    guardar
}