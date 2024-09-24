import Store from "../models/storeModel.js";
import Retirada from "../models/retiradaModel.js";
import Game from "../models/gameModel.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Op, fn, col, Sequelize } from 'sequelize';
import { getDistance } from 'geolib';
import Usuario from "../models/usuarioModel.js";
import mongoose from "mongoose";

export async function criarUsuario(req, res) {
  const { username, senha } = req.body;
  try {
      const usuario = await Usuario.create({
          username,
          senha
      });
      res.redirect("/");
  } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ message: 'Erro ao criar usuário' });
  }
}

export async function renderizarPaginaLogin(req, res) {
    res.render('paginaLogin');
    
}
export async function renderizarPaginaCadastrar(req, res) {
    res.render('paginaCadastrar');
}

export async function logar (req, res) {
  const { username, senha, latitude, longitude } = req.body;

  try {
      
      const user = await Usuario.findOne({ where: { username, senha } });

      if (user) {
          req.session.username = username;
          req.session.latitude = latitude;
          req.session.longitude = longitude;
          res.redirect(`/home`);
      } else {
          res.status(401).send('Credenciais inválidas');
      }
  } catch (error) {
      console.error('Erro ao autenticar:', error);
      res.status(500).send('Erro interno do servidor');
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const distance = getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
  );
  return distance;
}

export async function renderizarPaginaHome(req, res) {
  const userLatitude = parseFloat(req.session.latitude); 
  const userLongitude = parseFloat(req.session.longitude); 
  const proximityRadius = 50000;
  try {
    
    const games = await Game.findAll();
    const stores = await Store.find();

    const nearbyGames = games.filter(game => {
        const distance = calculateDistance(
            userLatitude,
            userLongitude,
            game.location.coordinates[1],
            game.location.coordinates[0] 
        );
        return distance <= proximityRadius; 
    });

    const farAwayGames = games.filter(game => {
        const distance = calculateDistance(
            userLatitude,
            userLongitude,
            game.location.coordinates[1], 
            game.location.coordinates[0]  
        );
        return distance > proximityRadius;
    });
    res.render('paginaHome', { nearbyGames, farAwayGames, stores, username: req.session.username });
} catch (error) {
    console.error('Erro ao buscar jogos:', error);
    res.status(500).send('Erro interno do servidor');
}
}

export async function renderizarPaginaJogos(req, res) {
  try {
      const games = await Game.findAll();
      res.render('paginaJogos', { games });
  } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      res.status(500).send('Erro interno do servidor');
  }
}

export function renderizarPaginaItem(req, res) {
  res.render('paginaItem', {title: 'Compra'});
}

export async function getAllStores(req, res) {
  const stores = await Store.find();
  res.json(stores);
}

export async function renderizarPaginaAgendar(req, res) {
  res.render('paginaAgendarRetirada');
}

export async function agendarRetirada(req, res) {
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

export async function renderizarPaginaMeusAnuncios(req, res) {
  const usuarioUsername = req.session.username;
  const games = await Game.findAll({ where: { usuarioUsername } });
  res.render('paginaMeusAnuncios', { games })
}

export async function renderizarPaginaRetiradas(req, res) {
  const retiradas = await Retirada.find();
  res.render('paginaMinhasRetiradas', { retiradas });
}

export async function fetchRetiradas(req, res) {
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

export async function excluirRetirada(req, res) {
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

export async function marcarComoConcluida(req, res) {
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadPath = 'uploads/';
      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export async function renderizarPaginaAnunciar(req, res) {
  const username = req.query.username;
  try {
      res.render('paginaAnunciar', { username}); 
  } catch (error) {
      console.error("Erro ao renderizar a página de anúncio:", error);
      res.status(500).send("Erro ao renderizar a página de anúncio.");
  }
}

export async function anunciarJogo(req, res) {
  try {
      const uploadMiddleware = upload.single('image');

      
      uploadMiddleware(req, res, async (err) => {
          if (err) {
              console.error('Erro ao fazer upload da imagem:', err);
              return res.status(500).send("Erro ao fazer upload da imagem.");
          }

          const { title, description, price, platform} = req.body;
          const username= req.session.username; 
          const latitude = req.session.latitude;
          const longitude = req.session.longitude;

          const novoJogo = await Game.create({
              title,
              description,
              price,
              imageUrl: req.file ? req.file.path : null,  
              platform,
              location: {
                  type: 'Point',
                  coordinates: [parseFloat(longitude), parseFloat(latitude)]
              },
              usuarioUsername: username
          });

          console.log("Jogo anunciado com sucesso:", novoJogo);
          res.redirect(`/home`);  
      });

  } catch (error) {
      console.error("Erro ao anunciar o jogo:", error);
      res.status(500).send("Erro ao anunciar o jogo.");
  }
}

export async function deletarJogo(req, res) {
  const { id } = req.params;

  try {
      const game = await Game.findByPk(id);
      if (!game) {
          return res.status(404).json({ message: 'Jogo não encontrado.' });
      }

      await game.destroy();
      return res.status(200).json({ message: 'Jogo deletado com sucesso!' });
  } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar o jogo.', error });
  }
}

export async function editarJogo(req, res) {
  const { id } = req.params;
  const { title, price } = req.body;

  try {
      const game = await Game.findByPk(id);
      if (!game) {
          return res.status(404).json({ message: 'Jogo não encontrado.' });
      }

      game.title = title;
      game.price = price;
      await game.save();

      return res.status(200).json({ message: 'Jogo editado com sucesso!', game });
  } catch (error) {
      return res.status(500).json({ message: 'Erro ao editar o jogo.', error });
  }
}

export async function searchGames(req, res) {
  const searchTerm = req.query.query; 

  if (!searchTerm) {
      return res.status(400).send('Termo de busca não fornecido');
  }

  try {
      const games = await Game.findAll({
          where: {
            [Op.or]: [
                { title: { [Op.iLike]: `%${searchTerm}%` } }
            ]
        }
      });

      res.render('paginaResultadosBusca', { games });
  } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      res.status(500).send('Erro interno ao buscar jogos');
  }
}

export async function deslogar(req, res) {
  req.session.destroy((err) => {
    if (err) {
        console.error('Erro ao encerrar a sessão:', err);
        return res.status(500).send('Erro ao encerrar a sessão');
    }
    res.redirect('/'); 
});
}