const { Usuario } = require('../models');
const { Op } = require('sequelize');

class ServicoUsuario {
  async listarTodos(filtros = {}) {
    const onde = {};
    if (filtros.nome) {
      onde.nome = { [Op.iLike]: `%${filtros.nome}%` };
    }
    if (filtros.email) {
      onde.email = { [Op.iLike]: `%${filtros.email}%` };
    }
    if (filtros.ativo !== undefined) {
      onde.ativo = filtros.ativo;
    }

    const usuarios = await Usuario.findAll({
      where: onde,
      attributes: { exclude: ['senha', 'token_recuperacao_senha', 'data_expiracao_token'] },
      order: [['nome', 'ASC']]
    });
    return usuarios;
  }

  async buscarPorId(id) {
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['senha', 'token_recuperacao_senha', 'data_expiracao_token'] }
    });
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
  }

  async atualizar(id, dados) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Impede a atualização da senha por este método
    if (dados.senha) {
      throw new Error('A senha não pode ser atualizada por esta rota. Use a funcionalidade de "resetar senha".');
    }

    // Verifica se o novo email já está em uso por outro usuário
    if (dados.email && dados.email !== usuario.email) {
      const usuarioExistente = await Usuario.findOne({ where: { email: dados.email } });
      if (usuarioExistente) {
        throw new Error('O email informado já está em uso.');
      }
    }

    await usuario.update(dados);

    // Retorna o usuário atualizado sem a senha
    const usuarioAtualizado = await this.buscarPorId(id);
    return usuarioAtualizado;
  }

  async inativar(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    usuario.ativo = false;
    await usuario.save();
    return { mensagem: 'Usuário inativado com sucesso.' };
  }

  async ativar(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    usuario.ativo = true;
    await usuario.save();
    return { mensagem: 'Usuário ativado com sucesso.' };
  }
}

module.exports = new ServicoUsuario();

