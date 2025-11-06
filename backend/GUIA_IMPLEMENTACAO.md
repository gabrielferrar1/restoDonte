# Guia de Implementação - RestôDonte

## 📋 O que foi implementado

Este documento descreve o que foi implementado no projeto RestôDonte e como você pode continuar o desenvolvimento.

### ✅ Estrutura Básica Implementada

1. **Servidor Express** (`backend/src/server.js`)
   - Servidor HTTP rodando na porta 3000 (configurável via `.env`)
   - Middleware para processamento de JSON
   - Sistema de roteamento modular
   - Tratamento de erros global
   - Verificação de conexão com banco de dados na inicialização

2. **Configuração de Banco de Dados** (`backend/src/config/database.js`)
   - Configuração PostgreSQL com Sequelize
   - Suporte a SSL opcional (controlado via variável `DB_SSL`)
   - Ambiente de desenvolvimento configurado

3. **Estrutura de Pastas Completa**
   ```
   backend/src/
   ├── config/         # Configurações (banco de dados, etc.)
   ├── controllers/    # Controladores HTTP
   ├── models/         # Modelos Sequelize
   ├── routes/         # Rotas da API
   ├── services/       # Lógica de negócio
   └── database/
       ├── migrations/ # Migrations do banco
       └── seeders/    # Seeders de dados iniciais
   ```

4. **Módulo Mesa (Exemplo Completo)**
   - ✅ Model: `Mesa.js` com validações
   - ✅ Service: `mesaService.js` com regras de negócio
   - ✅ Controller: `mesaController.js` com endpoints REST
   - ✅ Routes: `mesaRoutes.js` com todas as rotas
   - ✅ Migration: Criação da tabela `mesas`
   - ✅ Seeder: Dados iniciais (10 mesas)

### 🎯 Funcionalidades da API de Mesas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/mesas` | Lista todas as mesas (aceita filtro `?status=livre`) |
| GET | `/api/mesas/:id` | Busca uma mesa específica |
| POST | `/api/mesas` | Cria uma nova mesa |
| PUT | `/api/mesas/:id` | Atualiza uma mesa |
| PATCH | `/api/mesas/:id/status` | Altera apenas o status da mesa |
| DELETE | `/api/mesas/:id` | Remove uma mesa (não permite se estiver ocupada) |

### 📝 Exemplo de Requisições

#### Criar uma mesa
```bash
curl -X POST http://localhost:3000/api/mesas \
  -H "Content-Type: application/json" \
  -d '{
    "numero": 11,
    "capacidade": 4,
    "status": "livre"
  }'
```

#### Listar mesas
```bash
curl http://localhost:3000/api/mesas
```

#### Alterar status de uma mesa
```bash
curl -X PATCH http://localhost:3000/api/mesas/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "ocupada"}'
```

## 🚀 Como Testar o que Foi Implementado

### 1. Prepare o ambiente

```bash
# Navegue até a pasta do backend
cd backend

# Certifique-se de que as dependências estão instaladas
npm install

# Configure o arquivo .env
cp .env.example .env
# Edite o .env com as credenciais do seu PostgreSQL
```

### 2. Configure o PostgreSQL

Certifique-se de que o PostgreSQL está rodando e crie o banco de dados:

```sql
CREATE DATABASE restodonte;
```

Ou via linha de comando:
```bash
createdb restodonte
```

### 3. Execute as Migrations

```bash
npx sequelize-cli db:migrate
```

Isso criará a tabela `mesas` no banco de dados.

### 4. (Opcional) Popule com Dados Iniciais

```bash
npx sequelize-cli db:seed:all
```

Isso adicionará 10 mesas iniciais ao banco.

### 5. Inicie o Servidor

```bash
npm run dev
```

Você deve ver:
```
✓ Conexão com o banco de dados estabelecida com sucesso.
✓ Servidor rodando na porta 3000
✓ Ambiente: development
✓ Health check disponível em: http://localhost:3000/health
✓ API disponível em: http://localhost:3000/api
```

### 6. Teste os Endpoints

Abra seu navegador ou use uma ferramenta como Postman/Insomnia:

- **Health Check**: http://localhost:3000/health
- **Info da API**: http://localhost:3000/api
- **Listar Mesas**: http://localhost:3000/api/mesas

## 📚 Próximos Passos para Desenvolvimento

### 1. Implementar Modelo de Cliente

Crie arquivos seguindo o padrão do módulo Mesa:

1. **Model**: `backend/src/models/Cliente.js`
   ```javascript
   // Campos sugeridos: nome, telefone, email, cpf
   ```

2. **Migration**: 
   ```bash
   npx sequelize-cli migration:generate --name criar-tabela-clientes
   ```

3. **Service**: `backend/src/services/clienteService.js`
4. **Controller**: `backend/src/controllers/clienteController.js`
5. **Routes**: `backend/src/routes/clienteRoutes.js`
6. **Registrar em**: `backend/src/routes/index.js`

### 2. Implementar Modelo de Item do Menu

Campos sugeridos:
- nome
- descricao
- categoria (bebida, entrada, prato principal, sobremesa)
- preco
- disponivel (boolean)
- imagemUrl (opcional)

### 3. Implementar Modelo de Comanda

Campos sugeridos:
- mesaId (FK para Mesa)
- clienteId (FK para Cliente, opcional)
- status (aberta, fechada)
- dataAbertura
- dataFechamento
- total

**Associações importantes:**
```javascript
// No model Comanda
Comanda.belongsTo(models.Mesa, { foreignKey: 'mesaId' });
Comanda.belongsTo(models.Cliente, { foreignKey: 'clienteId' });
Comanda.hasMany(models.Pedido, { foreignKey: 'comandaId' });

// No model Mesa
Mesa.hasMany(models.Comanda, { foreignKey: 'mesaId' });
```

### 4. Implementar Modelo de Pedido

Campos sugeridos:
- comandaId (FK para Comanda)
- itemMenuId (FK para ItemMenu)
- quantidade
- precoUnitario (armazenar o preço no momento do pedido)
- subtotal (quantidade * precoUnitario)
- observacoes

### 5. Implementar Modelo de Pagamento

Campos sugeridos:
- comandaId (FK para Comanda)
- formaPagamento (dinheiro, cartao_debito, cartao_credito, pix)
- valor
- dataPagamento

### 6. Adicionar Funcionalidades Avançadas

- [ ] Autenticação de usuários (garçons, administradores)
- [ ] Validação de CPF no modelo Cliente
- [ ] Cálculo automático de totais de comanda
- [ ] Histórico de comandas fechadas
- [ ] Relatórios de vendas
- [ ] Sistema de gorjeta
- [ ] Dashboard administrativo

## 🛠️ Comandos Úteis

### Sequelize CLI

```bash
# Criar uma nova migration
npx sequelize-cli migration:generate --name nome-da-migration

# Executar migrations pendentes
npx sequelize-cli db:migrate

# Reverter última migration
npx sequelize-cli db:migrate:undo

# Criar um novo seeder
npx sequelize-cli seed:generate --name nome-do-seeder

# Executar todos os seeders
npx sequelize-cli db:seed:all

# Reverter todos os seeders
npx sequelize-cli db:seed:undo:all
```

### NPM

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (com auto-reload)
npm run dev

# Rodar em produção
npm start
```

## 📖 Recursos de Aprendizado

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [REST API Best Practices](https://restfulapi.net/)

## 🐛 Solução de Problemas

### Erro de conexão com o banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco de dados existe
- Ajuste a configuração de SSL se necessário (`DB_SSL=false` para desenvolvimento local)

### Erro nas migrations
- Verifique se o arquivo `.sequelizerc` está correto
- Confirme que o banco de dados existe
- Verifique os logs de erro para detalhes

### Porta já em uso
- Altere a porta no arquivo `.env`: `PORT=3001`
- Ou pare o processo que está usando a porta 3000

## 📄 Estrutura dos Arquivos README

Cada pasta do projeto contém um arquivo `README.md` com:
- Explicação da função da pasta
- Exemplos de código
- Lista de arquivos que devem ser criados
- Boas práticas

Consulte esses arquivos para orientação durante o desenvolvimento!

---

**Desenvolvido como projeto final de Programação II e Banco de Dados II**
