import { Sequelize } from 'sequelize';
import { Precio, Categoria, Propiedad, Tipo, Imagen } from '../models/index.js';

const inicio = async (req, res) => {

    const [categorias, precios, tipos, casas, departamentos, bodegas, terrenos, propiedad] = await Promise.all([
        Categoria.findAll({ raw: true }),
        Precio.findAll({ raw: true }),
        Tipo.findAll({ raw: true }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                /* {
                    model: Precio,
                    as: 'precio'
                }, */
                {
                    model: Imagen,
                    as: 'imagenes'
                },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include: [
                /* {
                    model: Precio,
                    as: 'precio'
                }, */
                {
                    model: Imagen,
                    as: 'imagenes'
                },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 3
            },
            include: [
                /* {
                    model: Precio,
                    as: 'precio'
                }, */
                {
                    model: Imagen,
                    as: 'imagenes'
                },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 4
            },
            include: [
                /* {
                    model: Precio,
                    as: 'precio'
                }, */
                {
                    model: Imagen,
                    as: 'imagenes'
                },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ]);

    res.render('inicio', {
        pagina: 'Inicio',
        propiedad,
        categorias,
        precios,
        tipos,
        casas,
        departamentos,
        bodegas,
        terrenos,
        csrfToken: req.csrfToken(),
    });
};

const categoria = async (req, res) => {
    const { id } = req.params;

    console.log(id);

    //Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
        return res.redirect('/404');
    }
    //Obtener las propiedades de la categoria
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            /* { model: Precio, as: 'precio' }, */
            { model: Imagen, as: 'imagenes' },
        ]
    })

    res.render('categoria', {
        pagina: `${categoria.nombre}s en Venta`,
        propiedades,
        csrfToken: req.csrfToken()
    })

};

const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'No Encontrada',
        csrfToken: req.csrfToken()
    })
};

const buscador = async (req, res) => {
    const { termino } = req.body;
    // validar que temrino no este vacio

    if (!termino.trim()) {
        return res.redirect('back');
    }

    // pero si hay algo entonces consultamos propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like]: '%' + termino + '%'
            }
        },
        include: [
            /* { model: Precio, as: 'precio' }, */
            { model: Imagen, as: 'imagenes' },
        ]
    })

    res.render('busqueda', {
        pagina: 'Resultados de la Busqueda',
        propiedades,
        csrfToken: req.csrfToken()
    });
};

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}