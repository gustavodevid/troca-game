import { Router } from "express";

import RetiradaController from "../controllers/retirada.controller.js";

const router = Router();

router.delete('/:id', RetiradaController.excluirRetirada);

router.patch('/:id/concluir', RetiradaController.marcarComoConcluida);

router.post('/agendar', RetiradaController.agendarRetirada);

router.post('/', RetiradaController.fetchRetiradas);

export default router;