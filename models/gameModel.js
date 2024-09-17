import sequelize from '../db/sequelize.js';
import { DataTypes } from 'sequelize';

const Game = sequelize.define('Game', {
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
});


async function sincronizar(){
    await Game.sync();
    console.log("Modelo Game sincronizado");
}

sincronizar();

export default Game;
