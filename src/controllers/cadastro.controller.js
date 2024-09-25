import Usuario from "../models/usuarioModel.js";

class CadastroController {
async criarUsuario(req, res) {
    const { username, senha } = req.body;
    try {
        const usuario = await Usuario.create({
            username,
            senha
        });
        res.redirect("/app/login/");
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  }
  
async renderizarPaginaCadastrar(req, res) {
    res.render('paginaCadastrar');
  }
}

export default new CadastroController();