import { Router } from "express";

import PaginasController from "../controllers/paginas.controller.js";

const router = Router();

router.get('/home', PaginasController.renderizarPaginaHome);

router.get('/item', PaginasController.renderizarPaginaItem);

router.get('/agendar', PaginasController.renderizarPaginaAgendar);

router.get('/anunciar', PaginasController.renderizarPaginaAnunciar);

router.get('/meus-anuncios', PaginasController.renderizarPaginaMeusAnuncios);

router.get('/minhas-retiradas', PaginasController.renderizarPaginaRetiradas);

export default router;