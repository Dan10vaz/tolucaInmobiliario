import { Propiedad, Precio, Categoria, Tipo, Imagen } from '../models/index.js';

const propiedades = async (req, res) => {

    const propiedades = await Propiedad.findAll({
        include: [
            /*  { model: Precio, as: 'precio' }, */
            { model: Categoria, as: 'categoria' },
            { model: Tipo, as: 'tipo' },
            { model: Imagen, as: 'imagenes' },
        ]
    })

    res.json(propiedades)
};

export {
    propiedades
}