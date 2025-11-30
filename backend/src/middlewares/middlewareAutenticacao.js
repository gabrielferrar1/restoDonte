const ServicoAutenticacao = require('../services/ServicoAutenticacao');
const middlewareAutenticacao = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token não fornecido. Acesso não autorizado.'
      });
    }
    const decodificado = ServicoAutenticacao.verificarToken(token);
    req.usuario = decodificado;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};
module.exports = middlewareAutenticacao;
