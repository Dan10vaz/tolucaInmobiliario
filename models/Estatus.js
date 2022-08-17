import { DataTypes } from 'sequelize';
import db from '../config/dataBase.js';

const Estatus = db.define('estatus', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
})

export default Estatus;