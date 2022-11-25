import { DataTypes } from 'sequelize';
import db from '../config/dataBase.js';

const Imagen = db.define('imagenes', {
    imagenes: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

export default Imagen;