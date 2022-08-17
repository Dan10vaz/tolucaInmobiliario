import { DataTypes } from 'sequelize';
import db from '../config/dataBase.js';

const Tipo = db.define('tipos', {
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
})

export default Tipo;