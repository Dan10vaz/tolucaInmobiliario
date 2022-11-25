import jwt from 'jsonwebtoken'

const generateJWT = datos => jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, { expiresIn: '1d' })


//genera ID unicos para los tokens
const generateId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generateId,
    generateJWT
}