import nodemailer from 'nodemailer';

const emailRegister = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    });
    const { nombre, email, token } = data;
    //enviamos el email
    await transport.sendMail({
        from: "TolucaGrupoInmobiliario.com",
        to: email,
        subject: 'Confirma tu cuenta de Toluca Grupo Inmobiliario',
        text: 'Confirma tu cuenta de Toluca Grupo Inmobiliario',
        html:
            `<h1>Hola ${nombre}, comprueba tu cuenta por favor</h1>
            <p>Tu cuenta ya esta lista, solo debes confirmarla... haz click en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar cuenta</a></p>
            <p>Si no has solicitado una cuenta, puedes ignorar este mensaje</p>`
    })
}

export {
    emailRegister
}