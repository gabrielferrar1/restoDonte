const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
class ServicoAutenticacao {
  async login(email, senha) {
    if (!email || !senha) {
      throw new Error('Email e senha são obrigatórios');
    }
    const usuario = await Usuario.findOne({ where: { email, ativo: true } });
    if (!usuario) {
      throw new Error('Credenciais inválidas');
    }
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome },
      process.env.JWT_SECRET || 'seu_secret_aqui_mudar_em_producao',
      { expiresIn: '8h' }
    );
    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    };
  }
  async registrar(nome, email, senha) {
    if (!nome || !email || !senha) {
      throw new Error('Nome, email e senha são obrigatórios');
    }
    if (senha.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres');
    }
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      ativo: true
    });
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    };
  }
  verificarToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'seu_secret_aqui_mudar_em_producao');
    } catch (erro) {
      throw new Error('Token inválido ou expirado');
    }
  }
}
module.exports = new ServicoAutenticacao();
