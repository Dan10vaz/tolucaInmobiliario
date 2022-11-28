import { unlink } from 'node:fs/promises';
import { validationResult } from 'express-validator';
import { Precio, Categoria, Tipo, Propiedad, Imagen } from '../models/index.js';
import { esVendedor } from '../helpers/index.js';


//Renderisa la vista de propiedades de un usuario
const admin = async (req, res) => {

    //Leer QueryString

    const { pagina: paginaActual } = req.query;

    const expresion = /^[1-9]$/

    if (!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const { id } = req.usuario;

        //Limites y offset para el paginador

        const limit = 3;
        const offset = ((paginaActual * limit) - limit);

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                    {
                        model: Imagen,
                        as: 'imagenes'
                    },
                    {
                        model: Categoria,
                        as: 'categoria'
                    },
                    {
                        model: Precio,
                        as: 'precio'
                    }
                ],
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })
        ])

        res.render('propiedades/admin', {
            pagina: 'Mis Propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limit,
        });

    } catch (error) {
        console.log(error)
    }
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

const almacenarImagen = async (req, res, next) => {
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

    try {
        //almacenar imagen y publicar propiedad
        console.log(req.file)
        propiedad.publicado = 1
        const guardar = await Imagen.create({
            imagenes: req.file.filename,
            propiedadeId: propiedad.id
        })
        console.log(guardar)
        await guardar.save()
        await propiedad.save()
        next()
    } catch (error) {
        console.log(error)
    }
}

const editar = async (req, res) => {

    // extraemos el id de la url
    const { id } = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    //Si no hay propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //revisar que quien visita la url es quien creo la propiedad
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }
    //consultar las categorias, precios y los tipos de propiedades
    const [categorias, precios, tipos] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
        Tipo.findAll()
    ]);

    res.render('propiedades/editar', {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        tipos,
        datos: propiedad
    });
}

const guardarCambios = async (req, res) => {

    //Verificar la validacion
    //validacion 
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        //consultar las categorias, precios y los tipos de propiedades
        const [categorias, precios, tipos] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll(),
            Tipo.findAll()
        ])

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            tipos,
            errores: resultado.array(),
            datos: req.body
        })
    }

    // extraemos el id de la url
    const { id } = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    //Si no hay propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //revisar que quien visita la url es quien creo la propiedad
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    //reescribir los datos y actualizarlos
    try {
        const { titulo, descripcion, categoria: categoriaId, precio: precioId, tipo: tipoId, habitaciones, estacionamiento, wc, calle, lat, lng } = req.body;

        propiedad.set({
            titulo,
            descripcion,
            categoriaId,
            precioId,
            tipoId,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng
        })
        await propiedad.save();
        res.redirect('/mis-propiedades')
    } catch (error) {
        console.log(error)
    }
};

const eliminar = async (req, res) => {
    // extraemos el id de la url
    const { id } = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    const imagenes = await Imagen.findAll({
        where: { propiedadeId: propiedad.id },
    });

    //Si no hay propiedad
    if (!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //revisar que quien visita la url es quien creo la propiedad
    if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    //Eliminar las imagenes asociadas
    /* await unlink(`public/uploads/${imagenes.imagenes}`) */

    for (let i = 0; i < imagenes.length; i++) {
        await unlink(`public/uploads/${imagenes[i].imagenes}`)
    }

    //eliminar la propiedad
    await Imagen.destroy({
        where: { propiedadeId: propiedad.id },
    });
    await propiedad.destroy();
    console.log('se borro la propiedad y las imagenes', imagenes, propiedad)
    res.redirect('/mis-propiedades')
};

// Muestra una propiedad

const mostrarPropiedad = async (req, res) => {
    const { id } = req.params;

    //comprobamos que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Precio, as: 'precio' },
            { model: Categoria, as: 'categoria' },
            { model: Tipo, as: 'tipo' },
            { model: Imagen, as: 'imagenes' },
        ]
    })

    if (!propiedad) {
        return res.redirect('/404')
    }

    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)

    })
};

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}