//Renderisa la vista de propiedades de un usuario
const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        barra: true
    });
}

//Formulario de creación de propiedades
const crear = (req, res) => {
    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        barra: true
    });
}

export {
    admin,
    crear
}