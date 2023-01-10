import { DataTypes } from 'sequelize';
import db from '../config/dataBase.js';

const Precio = db.define('precios', {
    precio: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
})

export default Precio;