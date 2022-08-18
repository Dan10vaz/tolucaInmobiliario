import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
const protegerRuta = async (req, res, next) => {
    //verificar si hay un token
    const { _token } = req.cookies;
    if (!_token) {
        return res.redirect('/auth/login');
    }
    //comprobar si hay un token 
    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);

        //almacenar el usuario en el request
        if (usuario) {
            req.usuario = usuario;
        } else {
            return res.redirect('/auth/login');
        }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }
}

export default protegerRuta;