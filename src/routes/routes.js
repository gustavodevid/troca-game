// routes/mapRoutes.js
import { Router } from 'express';
const router = Router();
import cadastroRoutes from "./cadastro.routes.js";
import loginRoutes from "./login.routes.js";
import paginasRoutes from "./paginas.routes.js";
import retiradaRoutes from "./retirada.routes.js";
import gameRoutes from "./game.routes.js";

router.use('/cadastro', cadastroRoutes);

router.use('/login', loginRoutes);

router.use('/pagina', paginasRoutes);

router.use('/retiradas', retiradaRoutes);

router.use('/game', gameRoutes);

export default router;
