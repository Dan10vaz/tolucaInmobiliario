import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generateId, generateJWT } from '../helpers/tokens.js'
import { emailRegister } from '../helpers/emails.js'
import { emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        //habilitamos el csrf
        csrfToken: req.csrfToken(),
    })
}

const autenticar = async (req, res) => {
    //validamos el formulario
    await check('email').isEmail().withMessage('El email es obligatorio').run(req);
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req)

    //verificamos si el resultado no esta vacio
    if (!resultado.isEmpty()) {
        // hay errores
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            //habilitamos el csrf
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const { email, password } = req.body;
    //comprobar que el usuario existe
    const user = await Usuario.findOne({ where: { email } })
    if (!user) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            //habilitamos el csrf
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario no existe' }],
        })
    }

    //comprobar que el usuario este confirmado
    if (!user.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            //habilitamos el csrf
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no ha sido confirmada, revisa tu email' }],
        })
    }

    //revisamos el password
    if (!user.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            //habilitamos el csrf
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El password es incorrecto' }],
        })
    }

    //autenticamos al usuario

    const token = generateJWT({
        id: user.id,
        nombre: user.nombre,
    })
    console.log(token)
    //almacenar en un cookie el token
    return res.cookie('_token', token, {
        httpOnly: true,
        /* secure:true */
    }).redirect('/mis-propiedades')
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
        //habilitamos el csrf
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async (req, res) => {
    //validacion
    await check('email').isEmail().withMessage('No es un email valido').run(req);
    let resultado = validationResult(req)

    //verificamos si el resultado no esta vacio
    if (!resultado.isEmpty()) {
        // hay errores
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Toluca Grupo Inmobiliario',
            //habilitamos el csrf
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    // Si esta bien y existe buscamos al usuario
    const { email } = req.body;
    const user = await Usuario.findOne({ where: { email } })
    if (!user) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Toluca Grupo Inmobiliario',
            //habilitamos el csrf
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El email no pertenece a ningun usuario' }],
        })
    }

    //generamos un token y enviamos al correo del usuario
    user.token = generateId();
    await user.save();

    //enviar email
    emailOlvidePassword({
        email: user.email,
        nombre: user.nombre,
        token: user.token,
    })
    //renderizar mensaje
    //Mostramos el mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Restablecer tu contraseña',
        mensaje: 'Hemos enviado un email con las instrucciones para restablecer tu contraseña',
    })
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const user = await Usuario.findOne({ where: { token } })
    if (!user) {
        return res.render('auth/confirmar-password', {
            pagina: 'Restablecer tu contraseña',
            mensaje: 'Hubo un error al restablecer tu contraseña, por favor intenta de nuevo',
            error: true,
        })
    }

    //mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Restablecer tu contraseña',
        //habilitamos el csrf
        csrfToken: req.csrfToken(),
    })
}

const nuevoPassword = async (req, res) => {
    // validar el nuevo password
    await check('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres').run(req);
    let resultado = validationResult(req)

    //verificamos si el resultado no esta vacio
    if (!resultado.isEmpty()) {
        // hay errores
        return res.render('auth/reset-password', {
            pagina: 'Restablecer tu Password',
            //habilitamos el csrf
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }
    const { token } = req.params;
    const { password } = req.body;
    //identificar quien hace el cambio
    const user = await Usuario.findOne({ where: { token } })

    //hashear el password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.token = null;

    await user.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password restablecido con exito',
        mensaje: 'Tu contraseña ha sido restablecida correctamente',
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    confirmar,
    formularioOlvidePassword,
    registrar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
}
