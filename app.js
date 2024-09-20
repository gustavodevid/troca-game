import express, { static as static_folder } from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import mapRoutes from './routes/mapRoutes.js';
import session from 'express-session';
import RedisStore from 'connect-redis';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.set('views', './views');

// Configuração de arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(static_folder('public'));

// Configuração de rotas
app.use('/', mapRoutes);

export default app;
