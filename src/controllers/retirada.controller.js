import Retirada from "../models/retiradaModel.js";

class RetiradaController {


async agendarRetirada(req, res) {
    try {
      const { store, nomeCliente, email, cpfCliente, item } = req.body;
      
      const loja = await Store.findOne( { name: store } );
        
      const localizacaoLoja = loja.location;
      
      const username = req.session.username;
      const retirada = new Retirada ({
        nomeCliente,
        cpfCliente,
        username,
        email,
        localizacaoLoja,
        item,
      });
  
      await retirada.save();
  
      res.render('paginaRetiradaAgendada', { retirada, store } );
    } catch (error) {
      console.error('Erro ao agendar retirada:', error);
      res.status(500).send('Erro ao agendar retirada');
    }
}

async fetchRetiradas(req, res) {
    try {
      const username = req.session.username;
      if (!username) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
      }
      const retiradas = await Retirada.find({ username});
      res.json(retiradas);
    } catch (error) {
      console.error('Erro ao buscar retiradas:', error);
      res.status(500).json({ message: 'Erro ao buscar retiradas.', error });
    }
}

async excluirRetirada(req, res) {
    const { id } = req.params;
    try {
      const resultado = await Retirada.deleteOne({ _id: id });
  
      if (resultado.deletedCount === 0) {
        return res.status(404).json({ message: 'Retirada não encontrada' });
      }
  
      res.json({ message: 'Retirada excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir retirada:', error);
      res.status(500).json({ message: 'Erro ao excluir retirada' });
    }
  }

async marcarComoConcluida(req, res) {
    try {
      const { id } = req.params;
      
      const retirada = await Retirada.findById(id);
  
      if (retirada) {
        retirada.concluida = true;
        await retirada.save();
  
        res.status(200).json({ message: 'Retirada marcada como concluída com sucesso.' });
      } else {
        res.status(404).json({ message: 'Retirada não encontrada.' });
      }
    } catch (error) {
      console.error('Erro ao marcar retirada como concluída:', error);
      res.status(500).json({ message: 'Erro ao marcar retirada como concluída.', error });
    }
  }
}

export default new RetiradaController();