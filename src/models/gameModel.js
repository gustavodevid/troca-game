import sequelize from '../db/sequelize.js';
import { DataTypes } from 'sequelize';
import Usuario from './usuarioModel.js';

const Game = sequelize.define('Game', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0  
        }
    },
    imageUrl: {
        type: DataTypes.STRING,  
        allowNull: true 
    },
    platform: {
        type: DataTypes.ENUM('PlayStation 4', 'PlayStation 5', 'Xbox', 'PC'),
        allowNull: false
    },
    location: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false    
    },
    usuarioUsername: {
        type: DataTypes.STRING,
        references: {
            model: Usuario,
            key: 'username'
        },
        allowNull: false
    }
});

Game.belongsTo(Usuario, { foreignKey: 'usuarioUsername' }); 
Usuario.hasMany(Game, { foreignKey: 'usuarioUsername' });

async function sincronizar(){
    await Game.sync();
    console.log("Modelo Game sincronizado");
}

sincronizar();

export default Game;
