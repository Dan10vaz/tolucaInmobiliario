import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/dataBase.js'

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
}, {
    //hasePassword es un metodo que se ejecuta antes de guardar el usuario en la base de datos
    hooks: {
        beforeCreate: async function (usuario) {
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password, salt)
        }
    },
    scopes: {
        eliminarPassword: {
            attributes: { exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt'] }
        }
    }
})

//Metodos personalizados
Usuario.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

export default Usuario
