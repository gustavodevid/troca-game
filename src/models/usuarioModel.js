import sequelize from '../db/sequelize.js';
import { DataTypes } from 'sequelize';

const Usuario = sequelize.define('Usuario', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    senha: {
      type: DataTypes.STRING
    }
  });
  
  async function sincronizar(){
    await Usuario.sync();
    console.log("Modelo Usuario Sincronizado");
  }
  
sincronizar();

export default Usuario; 