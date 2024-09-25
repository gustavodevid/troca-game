import { Router } from 'express';
import CadastroController from "../controllers/cadastro.controller.js";
const router = Router();

router.get('/', CadastroController.renderizarPaginaCadastrar);

router.post('/salvar', CadastroController.criarUsuario);

export default router;