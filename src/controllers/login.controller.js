import Usuario from "../models/usuarioModel.js";

class LoginController {

async renderizarPaginaLogin(req, res) {
    res.render('paginaLogin'); 
}

async logar (req, res) {
  const { username, senha, latitude, longitude } = req.body;

  try {
      
      const user = await Usuario.findOne({ where: { username, senha } });

      if (user) {
          req.session.username = username;
          req.session.latitude = latitude;
          req.session.longitude = longitude;
          res.redirect(`/pagina/home`);
      } else {
          res.status(401).send('Credenciais inválidas');
      }
  } catch (error) {
      console.error('Erro ao autenticar:', error);
      res.status(500).send('Erro interno do servidor');
  }
}

async deslogar(req, res) {
    req.session.destroy((err) => {
      if (err) {
          console.error('Erro ao encerrar a sessão:', err);
          return res.status(500).send('Erro ao encerrar a sessão');
      }
      res.redirect('/login'); 
  });
}
}

export default new LoginController();