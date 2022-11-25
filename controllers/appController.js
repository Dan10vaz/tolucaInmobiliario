import { Precio, Categoria, Propiedad, Tipo, Imagen } from '../models/index.js';


const inicio = async (req, res) => {

    const [categorias, precios, tipos, casas, departamentos, bodegas, terrenos] = await Promise.all([
        Categoria.findAll({ raw: true }),
        Precio.findAll({ raw: true }),
        Tipo.findAll({ raw: true }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                },
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
                {
                    model: Precio,
                    as: 'precio'
                },
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
                {
                    model: Precio,
                    as: 'precio'
                },
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
                {
                    model: Precio,
                    as: 'precio'
                },
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
        categorias,
        precios,
        tipos,
        casas,
        departamentos,
        bodegas,
        terrenos
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
            { model: Precio, as: 'precio' },
            { model: Imagen, as: 'imagenes' },
        ]
    })

    res.render('categoria', {
        pagina: `${categoria.nombre}s en Venta`,
        propiedades
    })

};

const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'No Encontrada'
    })
};

const buscador = (req, res) => {

};

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}