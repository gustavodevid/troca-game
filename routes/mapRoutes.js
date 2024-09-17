// routes/mapRoutes.js
import { Router } from 'express';
const router = Router();
import { renderizarPaginaHome, getAllStores, agendarRetirada, renderizarPaginaAgendar, renderizarPaginaItem, renderizarPaginaRetiradas, fetchRetiradas, excluirRetirada, marcarComoConcluida, renderizarPaginaJogos, renderizarPaginaLogin, logar, criarUsuario, renderizarPaginaCadastrar } from '../controllers/controllers.js';
import { anunciarJogo, renderizarPaginaAnunciar } from '../controllers/controllers.js';

router.get('/home', renderizarPaginaHome);

router.get('/item', renderizarPaginaItem);

router.get('/jogos', renderizarPaginaJogos);

router.get('/pagina-agendar', renderizarPaginaAgendar); 

router.post('/agendar', agendarRetirada);

router.get('/lojas', getAllStores);

router.get('/pagina-retiradas', renderizarPaginaRetiradas);

router.get('/retiradas', fetchRetiradas);

router.delete('/retiradas/:id', excluirRetirada);

router.patch('/retiradas/:id/concluir', marcarComoConcluida);

router.get('/anunciar', renderizarPaginaAnunciar);

router.post('/anunciar', anunciarJogo);

router.post('/logar', logar);

router.get('/', renderizarPaginaLogin);

router.post('/cadastrar', criarUsuario);

router.get('/cadastrar', renderizarPaginaCadastrar);

export default router;
