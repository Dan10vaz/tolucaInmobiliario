import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
    })
}





// Guardamos un usuario en la base de datos
const registrar = async (req, res) => {
    //validacion
    await check('nombre').notEmpty().withMessage('El Nombre no puede ir vacio').run(req);
    await check('email').isEmail().withMessage('No es un email valido').run(req);
    await check('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no coinciden').run(req);
    let resultado = validationResult(req)

    //verificamos si el resultado no esta vacio
    if (!resultado.isEmpty()) {
        // hay errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    //Extraemos los datos del formulario
    const { nombre, email, password } = req.body;

    // Verificamos que el usuario no este duplicado
    const userExists = await Usuario.findOne({ where: { email } })

    if (userExists) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{ msg: 'El usuario ya esta registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }
    // Creamos el usuario
    await Usuario.create({
        nombre,
        email,
        password,
        token: 123
    })
}






const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Toluca Grupo Inmobiliario',
    })
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
}
