import { validationResult } from 'express-validator';
import { Precio, Categoria, Tipo, Propiedad } from '../models/index.js';

//Renderisa la vista de propiedades de un usuario
const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades'
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
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        tipos,
        datos: {}
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
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            tipos,
            errores: resultado.array(),
            datos: req.body
        })
    }
    //crear registro
    const { titulo, descripcion, categoria: categoriaId, precio: precioId, tipo: tipoId, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body;

    const { id: usuarioId } = req.usuario;
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            categoriaId,
            precioId,
            tipoId,
            usuarioId,
            imagen: ''
        });

        const { id } = propiedadGuardada;

        res.redirect(`/propiedades/agregar-imagen/${id}`);
    } catch (error) {
        console.log(error);
    }
}


const agregarImagen = async (req, res) => {

    const { id } = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/mis-propiedades');
    }

    //validar que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('/mis-propiedades');
    }

    //validar que la propiedad pertneece a quien visita esta pagina
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagenes: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen
}