import Store  from "../models/storeModel.js";
import  Game  from "../models/gameModel.js";
import Retirada from "../models/retiradaModel.js";
import { getDistance } from 'geolib';

class PaginasController{

  calculateDistance(lat1, lon1, lat2, lon2) {
      const distance = getDistance(
          { latitude: lat1, longitude: lon1 },
          { latitude: lat2, longitude: lon2 }
      );
      return distance;
  }

renderizarPaginaRetiradas = async (req, res) => {
  const retiradas = await Retirada.find();
  res.render('paginaMinhasRetiradas', { retiradas });
}

renderizarPaginaHome= async (req, res) => {
const userLatitude = parseFloat(req.session.latitude); 
const userLongitude = parseFloat(req.session.longitude); 
const proximityRadius = 50000;
try {
  
  const games = await Game.findAll();
  const stores = await Store.find();

  const nearbyGames = games.filter(game => {
      const distance = this.calculateDistance(
          userLatitude,
          userLongitude,
          game.location.coordinates[1],
          game.location.coordinates[0] 
      );
      return distance <= proximityRadius; 
  });

  const farAwayGames = games.filter(game => {
      const distance = this.calculateDistance(
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

renderizarPaginaAgendar = async (req, res) => {
    res.render('paginaAgendarRetirada');
  }

renderizarPaginaItem = async (req, res) => {
    res.render('paginaItem', {title: 'Compra'});
  }

renderizarPaginaMeusAnuncios = async (req, res) => {
    const usuarioUsername = req.session.username;
    const games = await Game.findAll({ where: { usuarioUsername } });
    res.render('paginaMeusAnuncios', { games })
  }

renderizarPaginaAnunciar = async (req, res) => {
    const username = req.query.username;
    try {
        res.render('paginaAnunciar', { username}); 
    } catch (error) {
        console.error("Erro ao renderizar a página de anúncio:", error);
        res.status(500).send("Erro ao renderizar a página de anúncio.");
    }
  }
}

export default new PaginasController();