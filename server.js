import app from './app.js';
import sequelize from './db/sequelize.js';
import redis from 'redis';

const PORT = process.env.PORT || 3000;

// Configuração do Redis
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

redisClient.on('error', (err) => {
  console.error('Erro no Redis:', err);
});

redisClient.on('connect', () => {
  console.log('Conectado ao Redis');
});

const startServer = async () => {
  try {
      await redisClient.connect();

      await sequelize.authenticate();  
      console.log('Conectado ao banco de dados');

      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  } catch (error) {
      console.error('Erro ao iniciar o servidor:', error);
      process.exit(1); 
  }
};

startServer();