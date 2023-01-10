import Propiedad from "./Propiedad.js";
import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Tipo from "./Tipo.js";
import Imagen from "./Imagen.js";
import Usuario from "./Usuario.js";
import Mensaje from "./Mensaje.js";

/* 
Propiedad.belongsTo(Precio, { foreignKey: 'precioId' }); */
Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId' });
Propiedad.belongsTo(Tipo, { foreignKey: 'tipoId' });
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Propiedad.hasMany(Imagen);
Imagen.belongsTo(Propiedad);
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId' });

Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId' });



export {
    Propiedad,
    Categoria,
    Precio,
    Tipo,
    Imagen,
    Usuario,
    Mensaje
}