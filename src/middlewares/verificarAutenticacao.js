import session from 'express-session';

export function verificarAutenticacao(req, res, next) {
    if (req.session.username) {
        next(); 
    } else {
        res.redirect('/'); 
    }
}