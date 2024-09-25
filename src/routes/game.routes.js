import { Router } from "express";

import GameController from "../controllers/game.controller.js";

const router = Router();

router.post('/anunciar', GameController.anunciarJogo);

router.delete('/meus-anuncios/delete/:id', GameController.deletarJogo);

router.put('/meus-anuncios/edit/:id', GameController.editarJogo);

router.get('/search', GameController.searchGames);

export default router;