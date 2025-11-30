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
      process.env.JWT_SECRET,
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
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (erro) {
      throw new Error('Token inválido ou expirado');
    }
  }
  async solicitarRecuperacaoSenha(email) {
    if (!email) {
      throw new Error('Email é obrigatório');
    }

    const usuario = await Usuario.findOne({ where: { email, ativo: true } });
    if (!usuario) {
      throw new Error('Usuário não encontrado ou inativo');
    }

    const tokenRecuperacao = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const dataExpiracao = new Date(Date.now() + 60 * 60 * 1000); // 1 hora à frente

    usuario.token_recuperacao_senha = tokenRecuperacao;
    usuario.data_expiracao_token = dataExpiracao;
    await usuario.save();

    // Em um sistema real, enviaríamos este token por email.
    return {
      mensagem: 'Token de recuperação de senha gerado com sucesso',
      token_recuperacao_senha: tokenRecuperacao
    };
  }
  async resetarSenha(email, tokenRecuperacao, novaSenha) {
    if (!email || !tokenRecuperacao || !novaSenha) {
      throw new Error('Email, token de recuperação e nova senha são obrigatórios');
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !usuario.token_recuperacao_senha) {
      throw new Error('Solicitação de recuperação de senha não encontrada');
    }

    if (usuario.token_recuperacao_senha !== tokenRecuperacao) {
      throw new Error('Token de recuperação de senha inválido');
    }

    if (!usuario.data_expiracao_token || usuario.data_expiracao_token < new Date()) {
      throw new Error('Token de recuperação de senha expirado');
    }

    if (novaSenha.length < 6) {
      throw new Error('A nova senha deve ter no mínimo 6 caracteres');
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    usuario.senha = senhaHash;
    usuario.token_recuperacao_senha = null;
    usuario.data_expiracao_token = null;
    await usuario.save();

    return { mensagem: 'Senha atualizada com sucesso' };
  }
}
module.exports = new ServicoAutenticacao();
