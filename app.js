import express, { static as static_folder } from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import routes from './src/routes/routes.js';
import session from 'express-session';
import RedisStore from 'connect-redis';
import redis from 'redis';
import connectMongo from './src/db/mongo.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

redisClient.connect();
connectMongo();
// Middleware para sessões
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'root',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } 
}));

// Middleware para análise de corpo
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de visualizações
app.set('view engine', 'ejs');
app.set('views', 'src/views');

// Configuração de arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'src/public')));

// Configuração de rotas
app.use(routes);

export default app;
