import LoginController from "../controllers/login.controller.js";
import { Router } from 'express';
const router = Router();

router.get('/', LoginController.renderizarPaginaLogin);

router.post('/logar', LoginController.logar);

router.post('/logout', LoginController.deslogar); 

export default router;