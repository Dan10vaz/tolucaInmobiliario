import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generateId } from '../helpers/tokens.js'
import { emailRegister } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        //habilitamos el csrf
        csrfToken: req.csrfToken(),
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
            //habilitamos el csrf
            csrfToken: req.csrfToken(),
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
            //habilitamos el csrf
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya esta registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }
    // Creamos el usuario
    const user = await Usuario.create({
        nombre,
        email,
        password,
        token: generateId(),
    })

    // Enviamos el email de confirmacion
    emailRegister({
        nombre: user.nombre,
        email: user.email,
        token: user.token,
    })

    //Mostramos el mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada con exito',
        mensaje: 'Hemos enviado un email de confirmacion a tu cuenta de correo, presiona en el link para activar tu cuenta',
    })
}

// funcion que comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params;

    // verificar la cuenta con el token
    const user = await Usuario.findOne({ where: { token } })
    if (!user) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, por favor intenta de nuevo',
            error: true,
        })
    }
    // Confirmar la cuenta
    user.token = null;
    user.confirmado = true;
    await user.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada con exito',
        mensaje: 'Tu cuenta ha sido confirmada correctamente',
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
    confirmar,
    formularioOlvidePassword,
    registrar,
}
