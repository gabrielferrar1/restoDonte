'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar existência da tabela itens_comanda antes de criar triggers
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_class WHERE relname = 'itens_comanda' AND relkind = 'r'
        ) THEN
          RAISE EXCEPTION 'Tabela "itens_comanda" não existe. Execute a migration que cria a tabela antes de criar triggers.';
        END IF;
      END;
      $$;
    `);

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
        atualizado_em = CURRENT_TIMESTAMP
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
