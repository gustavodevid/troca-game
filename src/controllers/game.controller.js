import Game from "../models/gameModel.js";
import multer from 'multer'; 
import fs from 'fs'; 
import path from 'path'; 
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

class GameController {
 async  anunciarJogo(req, res) {
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
  
   async  deletarJogo(req, res) {
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
  
   async  editarJogo(req, res) {
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
  
   async  searchGames(req, res) {
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
}

export default new GameController();