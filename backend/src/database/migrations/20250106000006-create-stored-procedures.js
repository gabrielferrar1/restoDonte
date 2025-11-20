'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // STORED PROCEDURE 1: Obter relatório de vendas diárias
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION relatorio_vendas_diarias(data_inicio DATE, data_fim DATE)
      RETURNS TABLE (
        data DATE,
        total_comandas BIGINT,
        total_vendas NUMERIC,
        total_itens_vendidos BIGINT,
        ticket_medio NUMERIC
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          DATE(c.data_abertura) as data,
          COUNT(DISTINCT c.id) as total_comandas,
          COALESCE(SUM(c.valor_total), 0) as total_vendas,
          COALESCE(SUM(ic.quantidade), 0) as total_itens_vendidos,
          CASE 
            WHEN COUNT(DISTINCT c.id) > 0 THEN COALESCE(SUM(c.valor_total), 0) / COUNT(DISTINCT c.id)
            ELSE 0
          END as ticket_medio
        FROM comandas c
        LEFT JOIN itens_comanda ic ON c.id = ic.comanda_id
        WHERE c.status IN ('FECHADA', 'PAGA')
          AND DATE(c.data_abertura) BETWEEN data_inicio AND data_fim
        GROUP BY DATE(c.data_abertura)
        ORDER BY DATE(c.data_abertura) DESC;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // STORED PROCEDURE 2: Obter itens mais vendidos
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION itens_mais_vendidos(data_inicio DATE, data_fim DATE, limite INTEGER DEFAULT 10)
      RETURNS TABLE (
        item_id INTEGER,
        item_nome VARCHAR,
        tipo VARCHAR,
        quantidade_vendida BIGINT,
        receita_total NUMERIC
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          i.id as item_id,
          i.nome as item_nome,
          i.tipo::VARCHAR as tipo,
          SUM(ic.quantidade) as quantidade_vendida,
          SUM(ic.subtotal) as receita_total
        FROM itens_cardapio i
        INNER JOIN itens_comanda ic ON i.id = ic.item_cardapio_id
        INNER JOIN comandas c ON ic.comanda_id = c.id
        WHERE c.status IN ('FECHADA', 'PAGA')
          AND DATE(c.data_abertura) BETWEEN data_inicio AND data_fim
        GROUP BY i.id, i.nome, i.tipo
        ORDER BY quantidade_vendida DESC
        LIMIT limite;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // STORED PROCEDURE 3: Fechar comanda e calcular total
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION fechar_comanda(comanda_id_param INTEGER)
      RETURNS TABLE (
        comanda_id INTEGER,
        valor_total NUMERIC,
        total_itens BIGINT,
        status VARCHAR
      ) AS $$
      DECLARE
        comanda_status VARCHAR;
        todos_entregues BOOLEAN;
      BEGIN
        -- Verificar se a comanda existe e está aberta
        SELECT status INTO comanda_status
        FROM comandas
        WHERE id = comanda_id_param;

        IF comanda_status IS NULL THEN
          RAISE EXCEPTION 'Comanda não encontrada';
        END IF;

        IF comanda_status != 'ABERTA' THEN
          RAISE EXCEPTION 'Comanda já está fechada';
        END IF;

        -- Verificar se todos os itens foram entregues
        SELECT BOOL_AND(status_producao = 'ENTREGUE') INTO todos_entregues
        FROM itens_comanda
        WHERE comanda_id = comanda_id_param;

        IF NOT COALESCE(todos_entregues, FALSE) THEN
          RAISE EXCEPTION 'Não é possível fechar a comanda. Existem itens que não foram entregues.';
        END IF;

        -- Fechar a comanda
        UPDATE comandas
        SET status = 'FECHADA',
            data_fechamento = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = comanda_id_param;

        -- Retornar informações da comanda
        RETURN QUERY
        SELECT 
          c.id as comanda_id,
          c.valor_total,
          COUNT(ic.id) as total_itens,
          c.status::VARCHAR as status
        FROM comandas c
        LEFT JOIN itens_comanda ic ON c.id = ic.comanda_id
        WHERE c.id = comanda_id_param
        GROUP BY c.id, c.valor_total, c.status;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // STORED PROCEDURE 4: Obter pedidos pendentes por setor (Copa/Cozinha)
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION pedidos_pendentes_por_setor(setor VARCHAR)
      RETURNS TABLE (
        item_comanda_id INTEGER,
        comanda_id INTEGER,
        numero_mesa INTEGER,
        item_nome VARCHAR,
        quantidade INTEGER,
        status_producao VARCHAR,
        observacoes TEXT,
        tempo_preparo_minutos INTEGER,
        created_at TIMESTAMP
      ) AS $$
      BEGIN
        IF setor NOT IN ('PRATO', 'BEBIDA') THEN
          RAISE EXCEPTION 'Setor inválido. Use PRATO (Cozinha) ou BEBIDA (Copa)';
        END IF;

        RETURN QUERY
        SELECT 
          ic.id as item_comanda_id,
          c.id as comanda_id,
          c.numero_mesa,
          i.nome as item_nome,
          ic.quantidade,
          ic.status_producao::VARCHAR as status_producao,
          ic.observacoes,
          i.tempo_preparo_minutos,
          ic.criado_em
        FROM itens_comanda ic
        INNER JOIN comandas c ON ic.comanda_id = c.id
        INNER JOIN itens_cardapio i ON ic.item_cardapio_id = i.id
        WHERE i.tipo = setor::text
          AND c.status = 'ABERTA'
          AND ic.status_producao IN ('PENDENTE', 'EM_PRODUCAO', 'PRONTO')
        ORDER BY ic.criado_em ASC;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS relatorio_vendas_diarias(DATE, DATE);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS itens_mais_vendidos(DATE, DATE, INTEGER);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS fechar_comanda(INTEGER);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS pedidos_pendentes_por_setor(VARCHAR);');
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // STORED PROCEDURE 1: Obter relatório de vendas diárias
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION relatorio_vendas_diarias(data_inicio DATE, data_fim DATE)
      RETURNS TABLE (
        data DATE,
        total_comandas BIGINT,
        total_vendas NUMERIC,
        total_itens_vendidos BIGINT,
        ticket_medio NUMERIC
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          DATE(c.data_abertura) as data,
          COUNT(DISTINCT c.id) as total_comandas,
          COALESCE(SUM(c.valor_total), 0) as total_vendas,
          COALESCE(SUM(ic.quantidade), 0) as total_itens_vendidos,
          CASE 
            WHEN COUNT(DISTINCT c.id) > 0 THEN COALESCE(SUM(c.valor_total), 0) / COUNT(DISTINCT c.id)
            ELSE 0
          END as ticket_medio
        FROM comandas c
        LEFT JOIN itens_comanda ic ON c.id = ic.comanda_id
        WHERE c.status IN ('FECHADA', 'PAGA')
          AND DATE(c.data_abertura) BETWEEN data_inicio AND data_fim
        GROUP BY DATE(c.data_abertura)
        ORDER BY DATE(c.data_abertura) DESC;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // STORED PROCEDURE 2: Obter itens mais vendidos
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION itens_mais_vendidos(data_inicio DATE, data_fim DATE, limite INTEGER DEFAULT 10)
      RETURNS TABLE (
        item_id INTEGER,
        item_nome VARCHAR,
        tipo VARCHAR,
        quantidade_vendida BIGINT,
        receita_total NUMERIC
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          i.id as item_id,
          i.nome as item_nome,
          i.tipo::VARCHAR as tipo,
          SUM(ic.quantidade) as quantidade_vendida,
          SUM(ic.subtotal) as receita_total
        FROM itens_cardapio i
        INNER JOIN itens_comanda ic ON i.id = ic.item_cardapio_id
        INNER JOIN comandas c ON ic.comanda_id = c.id
        WHERE c.status IN ('FECHADA', 'PAGA')
          AND DATE(c.data_abertura) BETWEEN data_inicio AND data_fim
        GROUP BY i.id, i.nome, i.tipo
        ORDER BY quantidade_vendida DESC
        LIMIT limite;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // STORED PROCEDURE 3: Fechar comanda e calcular total
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION fechar_comanda(comanda_id_param INTEGER)
      RETURNS TABLE (
        comanda_id INTEGER,
        valor_total NUMERIC,
        total_itens BIGINT,
        status VARCHAR
      ) AS $$
      DECLARE
        comanda_status VARCHAR;
        todos_entregues BOOLEAN;
      BEGIN
        -- Verificar se a comanda existe e está aberta
        SELECT status INTO comanda_status
        FROM comandas
        WHERE id = comanda_id_param;

        IF comanda_status IS NULL THEN
          RAISE EXCEPTION 'Comanda não encontrada';
        END IF;

        IF comanda_status != 'ABERTA' THEN
          RAISE EXCEPTION 'Comanda já está fechada';
        END IF;

        -- Verificar se todos os itens foram entregues
        SELECT BOOL_AND(status_producao = 'ENTREGUE') INTO todos_entregues
        FROM itens_comanda
        WHERE comanda_id = comanda_id_param;

        IF NOT COALESCE(todos_entregues, FALSE) THEN
          RAISE EXCEPTION 'Não é possível fechar a comanda. Existem itens que não foram entregues.';
        END IF;

        -- Fechar a comanda
        UPDATE comandas
        SET status = 'FECHADA',
            data_fechamento = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = comanda_id_param;

        -- Retornar informações da comanda
        RETURN QUERY
        SELECT 
          c.id as comanda_id,
          c.valor_total,
          COUNT(ic.id) as total_itens,
          c.status::VARCHAR as status
        FROM comandas c
        LEFT JOIN itens_comanda ic ON c.id = ic.comanda_id
        WHERE c.id = comanda_id_param
        GROUP BY c.id, c.valor_total, c.status;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // STORED PROCEDURE 4: Obter pedidos pendentes por setor (Copa/Cozinha)
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION pedidos_pendentes_por_setor(setor VARCHAR)
      RETURNS TABLE (
        item_comanda_id INTEGER,
        comanda_id INTEGER,
        numero_mesa INTEGER,
        item_nome VARCHAR,
        quantidade INTEGER,
        status_producao VARCHAR,
        observacoes TEXT,
        tempo_preparo_minutos INTEGER,
        criado_em TIMESTAMP
      ) AS $$
      BEGIN
        IF setor NOT IN ('PRATO', 'BEBIDA') THEN
          RAISE EXCEPTION 'Setor inválido. Use PRATO (Cozinha) ou BEBIDA (Copa)';
        END IF;

        RETURN QUERY
        SELECT 
          ic.id as item_comanda_id,
          c.id as comanda_id,
          c.numero_mesa,
          i.nome as item_nome,
          ic.quantidade,
          ic.status_producao::VARCHAR as status_producao,
          ic.observacoes,
          i.tempo_preparo_minutos,
          ic.created_at
        FROM itens_comanda ic
        INNER JOIN comandas c ON ic.comanda_id = c.id
        INNER JOIN itens_cardapio i ON ic.item_cardapio_id = i.id
        WHERE i.tipo = setor::text
          AND c.status = 'ABERTA'
          AND ic.status_producao IN ('PENDENTE', 'EM_PRODUCAO', 'PRONTO')
        ORDER BY ic.created_at ASC;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS relatorio_vendas_diarias(DATE, DATE);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS itens_mais_vendidos(DATE, DATE, INTEGER);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS fechar_comanda(INTEGER);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS pedidos_pendentes_por_setor(VARCHAR);');
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // STORED PROCEDURE 1: Obter relatório de vendas diárias
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION relatorio_vendas_diarias(data_inicio DATE, data_fim DATE)
      RETURNS TABLE (
        data DATE,
        total_comandas BIGINT,
        total_vendas NUMERIC,
        total_itens_vendidos BIGINT,
        ticket_medio NUMERIC
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          DATE(c.data_abertura) as data,
          COUNT(DISTINCT c.id) as total_comandas,
          COALESCE(SUM(c.valor_total), 0) as total_vendas,
          COALESCE(SUM(ic.quantidade), 0) as total_itens_vendidos,
          CASE 
            WHEN COUNT(DISTINCT c.id) > 0 THEN COALESCE(SUM(c.valor_total), 0) / COUNT(DISTINCT c.id)
            ELSE 0
          END as ticket_medio
        FROM comandas c
        LEFT JOIN itens_comanda ic ON c.id = ic.comanda_id
        WHERE c.status IN ('FECHADA', 'PAGA')
          AND DATE(c.data_abertura) BETWEEN data_inicio AND data_fim
        GROUP BY DATE(c.data_abertura)
        ORDER BY DATE(c.data_abertura) DESC;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // STORED PROCEDURE 2: Obter itens mais vendidos
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION itens_mais_vendidos(data_inicio DATE, data_fim DATE, limite INTEGER DEFAULT 10)
      RETURNS TABLE (
        item_id INTEGER,
        item_nome VARCHAR,
        tipo VARCHAR,
        quantidade_vendida BIGINT,
        receita_total NUMERIC
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          i.id as item_id,
          i.nome as item_nome,
          i.tipo::VARCHAR as tipo,
          SUM(ic.quantidade) as quantidade_vendida,
          SUM(ic.subtotal) as receita_total
        FROM itens_cardapio i
        INNER JOIN itens_comanda ic ON i.id = ic.item_cardapio_id
        INNER JOIN comandas c ON ic.comanda_id = c.id
        WHERE c.status IN ('FECHADA', 'PAGA')
          AND DATE(c.data_abertura) BETWEEN data_inicio AND data_fim
        GROUP BY i.id, i.nome, i.tipo
        ORDER BY quantidade_vendida DESC
        LIMIT limite;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // STORED PROCEDURE 3: Fechar comanda e calcular total
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION fechar_comanda(comanda_id_param INTEGER)
      RETURNS TABLE (
        comanda_id INTEGER,
        valor_total NUMERIC,
        total_itens BIGINT,
        status VARCHAR
      ) AS $$
      DECLARE
        comanda_status VARCHAR;
        todos_entregues BOOLEAN;
      BEGIN
        -- Verificar se a comanda existe e está aberta
        SELECT status INTO comanda_status
        FROM comandas
        WHERE id = comanda_id_param;

        IF comanda_status IS NULL THEN
          RAISE EXCEPTION 'Comanda não encontrada';
        END IF;

        IF comanda_status != 'ABERTA' THEN
          RAISE EXCEPTION 'Comanda já está fechada';
        END IF;

        -- Verificar se todos os itens foram entregues
        SELECT BOOL_AND(status_producao = 'ENTREGUE') INTO todos_entregues
        FROM itens_comanda
        WHERE comanda_id = comanda_id_param;

        IF NOT COALESCE(todos_entregues, FALSE) THEN
          RAISE EXCEPTION 'Não é possível fechar a comanda. Existem itens que não foram entregues.';
        END IF;

        -- Fechar a comanda
        UPDATE comandas
        SET status = 'FECHADA',
            data_fechamento = CURRENT_TIMESTAMP,
            atualizado_em = CURRENT_TIMESTAMP
        WHERE id = comanda_id_param;

        -- Retornar informações da comanda
        RETURN QUERY
        SELECT 
          c.id as comanda_id,
          c.valor_total,
          COUNT(ic.id) as total_itens,
          c.status::VARCHAR as status
        FROM comandas c
        LEFT JOIN itens_comanda ic ON c.id = ic.comanda_id
        WHERE c.id = comanda_id_param
        GROUP BY c.id, c.valor_total, c.status;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // STORED PROCEDURE 4: Obter pedidos pendentes por setor (Copa/Cozinha)
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION pedidos_pendentes_por_setor(setor VARCHAR)
      RETURNS TABLE (
        item_comanda_id INTEGER,
        comanda_id INTEGER,
        numero_mesa INTEGER,
        item_nome VARCHAR,
        quantidade INTEGER,
        status_producao VARCHAR,
        observacoes TEXT,
        tempo_preparo_minutos INTEGER,
        created_at TIMESTAMP
      ) AS $$
      BEGIN
        IF setor NOT IN ('PRATO', 'BEBIDA') THEN
          RAISE EXCEPTION 'Setor inválido. Use PRATO (Cozinha) ou BEBIDA (Copa)';
        END IF;

        RETURN QUERY
        SELECT 
          ic.id as item_comanda_id,
          c.id as comanda_id,
          c.numero_mesa,
          i.nome as item_nome,
          ic.quantidade,
          ic.status_producao::VARCHAR as status_producao,
          ic.observacoes,
          i.tempo_preparo_minutos,
          ic.created_at
        FROM itens_comanda ic
        INNER JOIN comandas c ON ic.comanda_id = c.id
        INNER JOIN itens_cardapio i ON ic.item_cardapio_id = i.id
        WHERE i.tipo = setor::text
          AND c.status = 'ABERTA'
          AND ic.status_producao IN ('PENDENTE', 'EM_PRODUCAO', 'PRONTO')
        ORDER BY ic.created_at ASC;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS relatorio_vendas_diarias(DATE, DATE);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS itens_mais_vendidos(DATE, DATE, INTEGER);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS fechar_comanda(INTEGER);');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS pedidos_pendentes_por_setor(VARCHAR);');
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // TRIGGER 1: Atualizar subtotal do item_comanda automaticamente
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION atualizar_subtotal_item()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.subtotal = NEW.quantidade * NEW.preco_unitario;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_atualizar_subtotal_item
      BEFORE INSERT OR UPDATE OF quantidade, preco_unitario
      ON itens_comanda
      FOR EACH ROW
      EXECUTE FUNCTION atualizar_subtotal_item();
    `);

    // TRIGGER 2: Atualizar valor_total da comanda quando itens são adicionados/modificados/removidos
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION atualizar_valor_total_comanda()
      RETURNS TRIGGER AS $$
      DECLARE
        comanda_id_afetado INTEGER;
      BEGIN
        -- Determinar qual comanda foi afetada
        IF (TG_OP = 'DELETE') THEN
          comanda_id_afetado = OLD.comanda_id;
        ELSE
          comanda_id_afetado = NEW.comanda_id;
        END IF;

        -- Atualizar o valor total da comanda
        UPDATE comandas
        SET valor_total = (
          SELECT COALESCE(SUM(subtotal), 0)
          FROM itens_comanda
          WHERE comanda_id = comanda_id_afetado
        ),
        updated_at = CURRENT_TIMESTAMP
        WHERE id = comanda_id_afetado;

        IF (TG_OP = 'DELETE') THEN
          RETURN OLD;
        ELSE
          RETURN NEW;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_atualizar_valor_total_comanda
      AFTER INSERT OR UPDATE OF subtotal OR DELETE
      ON itens_comanda
      FOR EACH ROW
      EXECUTE FUNCTION atualizar_valor_total_comanda();
    `);

    // TRIGGER 3: Registrar automaticamente datas de produção
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION registrar_datas_producao()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Se status mudou para EM_PRODUCAO, registrar data de início
        IF (NEW.status_producao = 'EM_PRODUCAO' AND 
            (OLD.status_producao IS NULL OR OLD.status_producao = 'PENDENTE')) THEN
          NEW.data_producao_iniciada = CURRENT_TIMESTAMP;
        END IF;

        -- Se status mudou para PRONTO, registrar data de finalização
        IF (NEW.status_producao = 'PRONTO' AND 
            OLD.status_producao = 'EM_PRODUCAO') THEN
          NEW.data_producao_finalizada = CURRENT_TIMESTAMP;
        END IF;

        -- Se status mudou para ENTREGUE, registrar data de entrega
        IF (NEW.status_producao = 'ENTREGUE' AND 
            OLD.status_producao = 'PRONTO') THEN
          NEW.data_entrega = CURRENT_TIMESTAMP;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trigger_registrar_datas_producao
      BEFORE UPDATE OF status_producao
      ON itens_comanda
      FOR EACH ROW
      EXECUTE FUNCTION registrar_datas_producao();
    `);
  },

  async down(queryInterface, Sequelize) {
    // Remover triggers
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trigger_atualizar_subtotal_item ON itens_comanda;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trigger_atualizar_valor_total_comanda ON itens_comanda;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trigger_registrar_datas_producao ON itens_comanda;');

    // Remover functions
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS atualizar_subtotal_item();');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS atualizar_valor_total_comanda();');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS registrar_datas_producao();');
  }
};

