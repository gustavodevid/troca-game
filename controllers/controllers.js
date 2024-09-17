import Store from "../models/locationModel.js";
import Retirada from "../models/retiradaModel.js";
import Game from "../models/gameModel.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Op, fn, col } from 'sequelize';
import { getDistance } from 'geolib';
import Usuario from "../models/usuarioModel.js";

export async function criarUsuario(req, res) {
  const { username, senha } = req.body;
  try {
      const usuario = await Usuario.create({
          username,
          senha
      });

      res.status(201).json({ message: 'Usuário criado com sucesso!', usuario });
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
          res.redirect(`/home?latitude=${latitude}&longitude=${longitude}`);
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
  const userLatitude = parseFloat(req.query.latitude); 
  const userLongitude = parseFloat(req.query.longitude); 
  const proximityRadius = 50000;
  try {
   
    const games = await Game.findAll();

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

   
    res.render('paginaHome', { nearbyGames, farAwayGames });
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
  const locations = await Store.findAll();
  res.json(locations);
}

export async function renderizarPaginaAgendar(req, res) {
  res.render('paginaAgendarRetirada');
}

export async function agendarRetirada(req, res) {
  try {
    const { store, nomeCliente, email, cpfCliente, item } = req.body;
    
    const loja = await Store.findOne({ where: { name: store } });
      
    const localizacaoLoja = loja.location;

    const retirada = await Retirada.create({
      nomeCliente,
      cpfCliente,
      email,
      localizacaoLoja,
      item,
    });

    res.render('paginaRetiradaAgendada', { retirada, store } );
  } catch (error) {
    console.error('Erro ao agendar retirada:', error);
    res.status(500).send('Erro ao agendar retirada');
  }
}

export async function renderizarPaginaRetiradas(req, res) {
  res.render('paginaMinhasRetiradas')
}

export async function fetchRetiradas(req, res) {
  const pedidos = await Retirada.findAll();
  res.json(pedidos);
}

export async function excluirRetirada(req, res) {
  const { id } = req.params;
  const retirada = Retirada.destroy({ where: { id: id } });
  res.json(retirada);
}

export async function marcarComoConcluida(req, res) {
  try {
    const { id } = req.params;
    
    const retirada = await Retirada.findByPk(id);

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
  try {
      res.render('paginaAnunciar'); 
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

          const { title, description, price, platform, latitude, longitude } = req.body;

          
          const novoJogo = await Game.create({
              title,
              description,
              price,
              imageUrl: req.file ? req.file.path : null,  
              platform,
              location: {
                  type: 'Point',
                  coordinates: [parseFloat(longitude), parseFloat(latitude)]
              }
          });

          console.log("Jogo anunciado com sucesso:", novoJogo);
          res.redirect('/');  
      });

  } catch (error) {
      console.error("Erro ao anunciar o jogo:", error);
      res.status(500).send("Erro ao anunciar o jogo.");
  }
}