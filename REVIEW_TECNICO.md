# REVIEW TÉCNICO COMPLETO - Backend RestoDonte

Este documento apresenta uma análise detalhada de toda a estrutura técnica do backend, explicando cada camada, decisões arquiteturais e implementações.

---

## ÍNDICE

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Camada de Dados (Models)](#2-camada-de-dados-models)
3. [Camada de Negócio (Services)](#3-camada-de-negócio-services)
4. [Camada de Apresentação (Controllers)](#4-camada-de-apresentação-controllers)
5. [Roteamento (Routes)](#5-roteamento-routes)
6. [Middleware de Autenticação](#6-middleware-de-autenticação)
7. [Banco de Dados](#7-banco-de-dados)
8. [Servidor (server.js)](#8-servidor-serverjs)
9. [Fluxo de uma Requisição](#9-fluxo-de-uma-requisição)
10. [Decisões Técnicas](#10-decisões-técnicas)

---

## 1. VISÃO GERAL DA ARQUITETURA

O projeto segue o padrão **MVC + Services** (Model-View-Controller com camada de serviços), que separa as responsabilidades em camadas distintas:

```
Cliente (Postman/Frontend)
        ↓
    Rotas (routes/)
        ↓
    Middleware (autenticação)
        ↓
    Controller (validação básica)
        ↓
    Service (lógica de negócio)
        ↓
    Model (acesso ao banco)
        ↓
    PostgreSQL (banco de dados)
```

### Vantagens desta arquitetura:

1. **Separação de Responsabilidades**: Cada camada tem uma função específica
2. **Manutenibilidade**: Facilita alterações sem afetar outras camadas
3. **Testabilidade**: Cada camada pode ser testada isoladamente
4. **Reutilização**: Services podem ser usados por múltiplos controllers
5. **Escalabilidade**: Fácil adicionar novas funcionalidades

---

## 2. CAMADA DE DADOS (MODELS)

Os Models representam as entidades do banco de dados e definem a estrutura das tabelas.

### 2.1 Usuario.js

**Responsabilidade**: Gerenciar dados de usuários do sistema

**Campos principais:**
- `id`: Identificador único (gerado automaticamente)
- `nome`: Nome completo do usuário
- `email`: Email único para login
- `senha`: Senha criptografada com bcrypt
- `ativo`: Flag para soft delete (desativar sem remover)

**Validações:**
- Email deve ser válido (formato)
- Email deve ser único
- Senha é sempre armazenada como hash

**Exemplo de uso:**
```javascript
// Criar usuário
const usuario = await Usuario.create({
  nome: 'João Silva',
  email: 'joao@email.com',
  senha: hashDaSenha,
  ativo: true
});

// Buscar por email
const usuario = await Usuario.findOne({ 
  where: { email: 'joao@email.com', ativo: true } 
});
```

---

### 2.2 ItemCardapio.js

**Responsabilidade**: Representar itens do menu (pratos e bebidas)

**Campos principais:**
- `id`: Identificador único
- `nome`: Nome do item (ex: "Filé Mignon")
- `descricao`: Descrição detalhada
- `preco`: Valor em decimal (10,2)
- `tipo`: ENUM('PRATO', 'BEBIDA') - determina se vai para Cozinha ou Copa
- `ativo`: Controle de disponibilidade
- `tempo_preparo_minutos`: Estimativa de preparo

**Relacionamentos:**
- `hasMany` com ItemComanda (um item pode estar em várias comandas)

**Índices criados:**
- `tipo`: Para filtrar rapidamente por categoria
- `ativo`: Para buscar apenas itens disponíveis

**Exemplo de uso:**
```javascript
// Buscar pratos ativos
const pratos = await ItemCardapio.findAll({
  where: { tipo: 'PRATO', ativo: true }
});

// Buscar com preço
const item = await ItemCardapio.findByPk(1);
console.log(item.preco); // 45.90
```

---

### 2.3 Comanda.js

**Responsabilidade**: Representar uma mesa/conta no restaurante

**Campos principais:**
- `id`: Identificador único
- `numero_mesa`: Número da mesa física
- `nome_cliente`: Nome do cliente (opcional)
- `status`: ENUM('ABERTA', 'FECHADA', 'PAGA')
- `data_abertura`: Quando a comanda foi aberta
- `data_fechamento`: Quando foi fechada
- `valor_total`: Soma automática de todos os itens (via trigger)
- `observacoes`: Notas adicionais

**Relacionamentos:**
- `hasMany` com ItemComanda (uma comanda tem vários itens)

**Índices criados:**
- `status`: Para filtrar comandas abertas rapidamente
- `data_abertura`: Para relatórios por período
- `numero_mesa`: Para buscar comandas por mesa

**Fluxo de estados:**
```
ABERTA → FECHADA → PAGA
```

**Exemplo de uso:**
```javascript
// Abrir comanda
const comanda = await Comanda.create({
  numero_mesa: 5,
  nome_cliente: 'João Silva',
  status: 'ABERTA'
});

// Buscar comandas abertas
const abertas = await Comanda.findAll({
  where: { status: 'ABERTA' },
  include: ['itens']
});
```

---

### 2.4 ItemComanda.js

**Responsabilidade**: Representar cada item pedido em uma comanda

**Campos principais:**
- `id`: Identificador único
- `comanda_id`: FK para Comanda
- `item_cardapio_id`: FK para ItemCardapio
- `quantidade`: Quantidade pedida
- `preco_unitario`: Preço no momento do pedido (histórico)
- `subtotal`: quantidade × preco_unitario (calculado por trigger)
- `status_producao`: ENUM('PENDENTE', 'EM_PRODUCAO', 'PRONTO', 'ENTREGUE')
- `observacoes`: Pedidos especiais (ex: "sem cebola")
- `data_producao_iniciada`: Timestamp automático
- `data_producao_finalizada`: Timestamp automático
- `data_entrega`: Timestamp automático

**Relacionamentos:**
- `belongsTo` Comanda
- `belongsTo` ItemCardapio

**Por que guardar `preco_unitario` separado?**
- Mantém histórico: se o preço do item mudar no cardápio, pedidos antigos mantêm o preço original
- Auditoria: sabe-se exatamente quanto foi cobrado

**Fluxo de estados:**
```
PENDENTE → EM_PRODUCAO → PRONTO → ENTREGUE
```

**Exemplo de uso:**
```javascript
// Adicionar item à comanda
const item = await ItemComanda.create({
  comanda_id: 1,
  item_cardapio_id: 5,
  quantidade: 2,
  preco_unitario: 45.90,
  subtotal: 91.80, // calculado pela trigger
  status_producao: 'PENDENTE'
});
```

---

## 3. CAMADA DE NEGÓCIO (SERVICES)

Services contêm toda a lógica de negócio e regras da aplicação.

### 3.1 ServicoAutenticacao.js

**Responsabilidade**: Gerenciar autenticação e autorização

**Métodos principais:**

#### `login(email, senha)`
```javascript
// Validações:
1. Email e senha são obrigatórios?
2. Usuário existe no banco?
3. Usuário está ativo?
4. Senha confere com o hash?

// Se tudo ok:
1. Gera token JWT com dados do usuário
2. Token expira em 8 horas
3. Retorna token + dados do usuário (sem senha)
```

**Fluxo de login:**
```
1. Cliente envia email + senha
2. Service busca usuário no banco
3. Compara senha usando bcrypt.compare()
4. Gera JWT com payload: { id, email, nome }
5. Retorna token para o cliente
6. Cliente usa token em requisições futuras
```

#### `registrar(nome, email, senha)`
```javascript
// Validações:
1. Todos os campos obrigatórios?
2. Senha tem mínimo 6 caracteres?
3. Email já existe no banco?

// Se tudo ok:
1. Cria hash da senha com bcrypt (10 rounds)
2. Cria usuário no banco
3. Retorna dados do usuário (sem senha)
```

#### `verificarToken(token)`
```javascript
// Validações:
1. Token é válido?
2. Token não expirou?
3. Assinatura está correta?

// Se válido:
1. Retorna payload decodificado
2. Usado pelo middleware de autenticação
```

**Por que bcrypt?**
- Algoritmo de hash lento (proteção contra brute force)
- Salt automático (cada hash é único)
- Impossível reverter (one-way hash)

---

### 3.2 ServicoItemCardapio.js

**Responsabilidade**: Gerenciar itens do cardápio

**Métodos principais:**

#### `listarTodos(filtros)`
```javascript
// Filtros aceitos:
- tipo: 'PRATO' ou 'BEBIDA'
- ativo: true ou false
- nome: busca parcial (case-insensitive)

// Retorna lista ordenada por nome
```

#### `buscarPorId(id)`
```javascript
// Busca item específico
// Lança erro se não encontrado
```

#### `criar(dados)`
```javascript
// Validações:
1. Nome, preço e tipo são obrigatórios?
2. Tipo é 'PRATO' ou 'BEBIDA'?
3. Preço é maior que zero?

// Cria item no banco
```

#### `atualizar(id, dados)`
```javascript
// Validações:
1. Item existe?
2. Se preço fornecido, é maior que zero?
3. Se tipo fornecido, é válido?

// Atualiza apenas campos fornecidos
```

#### `deletar(id)`
```javascript
// Soft delete:
- Não remove do banco
- Apenas marca ativo = false
- Mantém histórico
```

**Por que soft delete?**
- Mantém integridade referencial
- Permite análise histórica
- Pode ser reativado facilmente

---

### 3.3 ServicoComanda.js

**Responsabilidade**: Gerenciar comandas e seus itens

**Métodos principais:**

#### `listarTodas(filtros)`
```javascript
// Filtros aceitos:
- status: 'ABERTA', 'FECHADA', 'PAGA'
- numero_mesa: número da mesa
- data_inicio e data_fim: período

// Retorna comandas com todos os itens incluídos
```

#### `buscarPorId(id)`
```javascript
// Retorna comanda com:
- Todos os itens (ItemComanda)
- Dados do cardápio de cada item
- Usado em várias operações
```

#### `abrir(dados)`
```javascript
// Validações:
1. Número da mesa é obrigatório?
2. Já existe comanda aberta para esta mesa?

// Cria comanda com:
- status: 'ABERTA'
- data_abertura: timestamp atual
- valor_total: 0 (será calculado pela trigger)
```

**Por que não permitir duas comandas abertas na mesma mesa?**
- Evita confusão no atendimento
- Facilita controle do garçom
- Mais simples para o sistema

#### `adicionarItem(comandaId, dados)`
```javascript
// Validações:
1. Comanda existe?
2. Comanda está aberta?
3. Item do cardápio existe?
4. Item está ativo?
5. Quantidade é válida (>= 1)?

// Fluxo:
1. Busca preço atual do item
2. Cria ItemComanda com:
   - preco_unitario: preço atual (histórico)
   - subtotal: calculado pela trigger
   - status_producao: 'PENDENTE'
3. Trigger atualiza valor_total da comanda
```

**Diagrama do fluxo:**
```
Cliente pede → Adiciona item → Trigger calcula subtotal
                                      ↓
                              Trigger atualiza total da comanda
```

#### `fecharComanda(comandaId)`
```javascript
// Validações:
1. Comanda existe?
2. Comanda está aberta?
3. Todos os itens foram entregues?

// Se válido:
1. Atualiza status: 'FECHADA'
2. Registra data_fechamento
3. Não pode mais adicionar itens
```

**Por que verificar se itens foram entregues?**
- Garante que o cliente recebeu tudo
- Evita fechamento acidental
- Melhor experiência do cliente

#### `registrarPagamento(comandaId)`
```javascript
// Validações:
1. Comanda existe?
2. Comanda está fechada?

// Atualiza status: 'PAGA'
// Finaliza o ciclo da comanda
```

---

### 3.4 ServicoProducao.js

**Responsabilidade**: Gerenciar produção na Copa e Cozinha

**Métodos principais:**

#### `listarPedidosPorSetor(setor)`
```javascript
// setor: 'PRATO' (Cozinha) ou 'BEBIDA' (Copa)

// Retorna apenas:
- Itens do tipo especificado
- De comandas abertas
- Com status: PENDENTE, EM_PRODUCAO ou PRONTO
- Ordenados por data de criação (FIFO)

// Inclui:
- Dados da comanda (mesa, cliente)
- Dados do item (nome, tempo de preparo)
```

**Por que separar por setor?**
- Copa e Cozinha têm telas diferentes
- Cada setor vê apenas seus pedidos
- Organização do trabalho

#### `iniciarProducao(itemComandaId)`
```javascript
// Validações:
1. Item existe?
2. Status é 'PENDENTE'?

// Atualiza:
- status_producao: 'EM_PRODUCAO'
- data_producao_iniciada: timestamp (via trigger)
```

#### `marcarComoPronto(itemComandaId)`
```javascript
// Validações:
1. Item existe?
2. Status é 'EM_PRODUCAO'?

// Atualiza:
- status_producao: 'PRONTO'
- data_producao_finalizada: timestamp (via trigger)
```

#### `marcarComoEntregue(itemComandaId)`
```javascript
// Validações:
1. Item existe?
2. Status é 'PRONTO'?

// Atualiza:
- status_producao: 'ENTREGUE'
- data_entrega: timestamp (via trigger)
```

**Fluxo completo de produção:**
```
1. Cliente pede → PENDENTE
2. Copa/Cozinha pega o pedido → EM_PRODUCAO
3. Termina de fazer → PRONTO
4. Garçom entrega → ENTREGUE
```

#### `obterEstatisticas(setor)`
```javascript
// Retorna contadores do dia:
- Pendentes
- Em produção
- Prontos
- Entregues
- Total

// Pode filtrar por setor (PRATO/BEBIDA) ou todos
```

---

### 3.5 ServicoRelatorio.js

**Responsabilidade**: Gerar relatórios usando stored procedures

**Métodos principais:**

#### `relatorioVendasDiarias(dataInicio, dataFim)`
```javascript
// Chama stored procedure do PostgreSQL
// Retorna por dia:
- Total de comandas
- Total de vendas (R$)
- Total de itens vendidos
- Ticket médio

// Usa apenas comandas FECHADAS ou PAGAS
```

#### `itensMaisVendidos(dataInicio, dataFim, limite)`
```javascript
// Chama stored procedure do PostgreSQL
// Retorna:
- Item (nome, tipo)
- Quantidade vendida
- Receita total

// Ordenado por quantidade (mais vendidos primeiro)
```

#### `relatorioDiarioSimplificado()`
```javascript
// Relatório rápido do dia atual
// Combina:
- Vendas do dia
- Top 5 itens mais vendidos
```

#### `relatorioPeriodo(dataInicio, dataFim)`
```javascript
// Relatório completo de período
// Retorna:
- Vendas por dia
- Top 20 itens mais vendidos
- Totais agregados do período
- Ticket médio do período
```

**Por que usar stored procedures para relatórios?**
- Performance: processamento no banco é mais rápido
- Menos tráfego de rede
- Lógica complexa fica no banco
- Requisito da disciplina de BD2

---

## 4. CAMADA DE APRESENTAÇÃO (CONTROLLERS)

Controllers recebem requisições HTTP, chamam services e retornam respostas.

### Estrutura padrão de um controller:

```javascript
class Controlador {
  async metodo(req, res) {
    try {
      // 1. Extrair dados da requisição
      const { parametro } = req.body; // ou req.query, req.params
      
      // 2. Chamar service
      const resultado = await Service.metodo(parametro);
      
      // 3. Retornar resposta de sucesso
      res.json({
        sucesso: true,
        dados: resultado
      });
    } catch (erro) {
      // 4. Tratar erro
      res.status(400).json({
        sucesso: false,
        mensagem: erro.message
      });
    }
  }
}
```

### Responsabilidades dos controllers:

1. **Extrair dados da requisição** (body, query, params)
2. **Validação básica** (dados obrigatórios presentes?)
3. **Chamar service apropriado**
4. **Formatar resposta HTTP**
5. **Tratar erros** (converter exceções em respostas HTTP)

### Códigos HTTP usados:

- `200 OK`: Operação bem-sucedida
- `201 Created`: Recurso criado
- `400 Bad Request`: Erro de validação
- `401 Unauthorized`: Não autenticado
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro do servidor

---

## 5. ROTEAMENTO (ROUTES)

Routes definem os endpoints da API e aplicam middlewares.

### Estrutura de um arquivo de rotas:

```javascript
const express = require('express');
const roteador = express.Router();
const Controlador = require('../controllers/Controlador');
const middlewareAutenticacao = require('../middlewares/middlewareAutenticacao');

// Aplicar middleware em todas as rotas
roteador.use(middlewareAutenticacao);

// Definir rotas
roteador.get('/', Controlador.listar);
roteador.post('/', Controlador.criar);

module.exports = roteador;
```

### Rotas implementadas:

#### /api/autenticacao
- POST /login - Login (pública)
- POST /registrar - Registro (pública)
- GET /verificar - Verificar token (pública)

#### /api/cardapio (protegidas)
- GET / - Listar itens
- GET /:id - Buscar item
- POST / - Criar item
- PUT /:id - Atualizar item
- DELETE /:id - Desativar item
- PATCH /:id/ativar - Reativar item

#### /api/comandas (protegidas)
- GET / - Listar comandas
- GET /:id - Buscar comanda
- POST / - Abrir comanda
- POST /:id/itens - Adicionar item
- PUT /:id/fechar - Fechar comanda
- PUT /:id/pagar - Registrar pagamento

#### /api/producao (protegidas)
- GET /copa - Pedidos da copa
- GET /cozinha - Pedidos da cozinha
- PUT /:id/iniciar - Iniciar produção
- PUT /:id/pronto - Marcar pronto
- PUT /:id/entregar - Marcar entregue
- PUT /:id/status - Atualizar status
- GET /estatisticas - Estatísticas

#### /api/relatorios (protegidas)
- GET /diario - Relatório do dia
- GET /vendas-diarias - Vendas por dia
- GET /itens-mais-vendidos - Itens mais vendidos
- GET /periodo - Relatório de período

---

## 6. MIDDLEWARE DE AUTENTICAÇÃO

O middleware intercepta requisições e verifica autenticação.

### Funcionamento:

```javascript
1. Cliente envia requisição com header:
   Authorization: Bearer <token>

2. Middleware extrai o token

3. Verifica token usando JWT:
   - Token é válido?
   - Token não expirou?
   - Assinatura está correta?

4. Se válido:
   - Decodifica payload
   - Adiciona dados em req.usuario
   - Chama next() (continua para controller)

5. Se inválido:
   - Retorna 401 Unauthorized
   - Não chama next() (requisição para aqui)
```

### Exemplo de token JWT:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6MSwibm9tZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkByZXN0b2RvbnRlLmNvbSIsImlhdCI6MTcwOTc1MzIwMCwiZXhwIjoxNzA5NzgyMDAwfQ.
signature_hash_here
```

Decodificado:
```json
{
  "id": 1,
  "nome": "Admin",
  "email": "admin@restodonte.com",
  "iat": 1709753200,  // issued at
  "exp": 1709782000   // expires
}
```

---

## 7. BANCO DE DADOS

### 7.1 Migrations

Migrations são scripts versionados que criam/modificam a estrutura do banco.

**Vantagens:**
- Versionamento do schema
- Histórico de mudanças
- Reversível (pode desfazer)
- Sincronização entre ambientes

**Ordem de execução:**
```
1. create-usuarios
2. create-itens-cardapio
3. create-comandas
4. create-itens-comanda (depende de 2 e 3)
5. create-triggers
6. create-stored-procedures
```

### 7.2 Triggers

#### Trigger 1: atualizar_subtotal_item
```sql
-- Quando: BEFORE INSERT ou UPDATE de quantidade/preco_unitario
-- O que faz: subtotal = quantidade × preco_unitario
-- Por que: Garante que subtotal está sempre correto
```

#### Trigger 2: atualizar_valor_total_comanda
```sql
-- Quando: AFTER INSERT/UPDATE/DELETE em itens_comanda
-- O que faz: valor_total = soma de todos os subtotais
-- Por que: Mantém total da comanda sempre atualizado
```

#### Trigger 3: registrar_datas_producao
```sql
-- Quando: BEFORE UPDATE de status_producao
-- O que faz:
  - PENDENTE → EM_PRODUCAO: registra data_producao_iniciada
  - EM_PRODUCAO → PRONTO: registra data_producao_finalizada
  - PRONTO → ENTREGUE: registra data_entrega
-- Por que: Auditoria automática do processo
```

### 7.3 Stored Procedures

#### 1. relatorio_vendas_diarias
```sql
-- Parâmetros: data_inicio, data_fim
-- Retorna por dia:
  - Total de comandas
  - Total de vendas
  - Total de itens
  - Ticket médio
-- Usa: agregações complexas com JOINs
```

#### 2. itens_mais_vendidos
```sql
-- Parâmetros: data_inicio, data_fim, limite
-- Retorna:
  - Item (id, nome, tipo)
  - Quantidade vendida
  - Receita total
-- Ordenado por: quantidade DESC
```

#### 3. fechar_comanda
```sql
-- Parâmetro: comanda_id
-- Validações:
  - Comanda existe?
  - Está aberta?
  - Todos itens entregues?
-- Se válido: atualiza status e data_fechamento
-- Retorna: dados da comanda fechada
```

#### 4. pedidos_pendentes_por_setor
```sql
-- Parâmetro: setor ('PRATO' ou 'BEBIDA')
-- Retorna: itens pendentes do setor
-- Ordenado por: data de criação (FIFO)
```

---

## 8. SERVIDOR (server.js)

O arquivo `server.js` é o ponto de entrada da aplicação.

### Fluxo de inicialização:

```javascript
1. Carregar variáveis de ambiente (.env)
2. Criar app Express
3. Configurar middlewares globais:
   - cors (permite requisições de outros domínios)
   - express.json (parse de JSON)
   - express.urlencoded (parse de formulários)
   - logger (log de requisições em dev)
4. Registrar rotas (/api)
5. Configurar tratamento de erros
6. Testar conexão com banco
7. Iniciar servidor na porta configurada
```

### Middlewares globais:

```javascript
// CORS - permite frontend acessar API
app.use(cors());

// Parse de JSON no body
app.use(express.json());

// Parse de form-data
app.use(express.urlencoded({ extended: true }));

// Logger (apenas em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}
```

### Tratamento de erros:

```javascript
// 404 - Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada'
  });
});

// 500 - Erro interno
app.use((erro, req, res, next) => {
  console.error('Erro:', erro);
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno do servidor',
    erro: process.env.NODE_ENV !== 'production' ? erro.message : undefined
  });
});
```

---

## 9. FLUXO DE UMA REQUISIÇÃO

### Exemplo completo: Adicionar item à comanda

```
1. CLIENTE
   POST http://localhost:3000/api/comandas/1/itens
   Authorization: Bearer token_jwt_aqui
   Body: { item_cardapio_id: 5, quantidade: 2 }

2. SERVIDOR (server.js)
   - Recebe requisição
   - Aplica middlewares globais
   - Roteia para /api

3. ROUTES (index.js)
   - Identifica rota /comandas
   - Roteia para comanda.routes.js

4. ROUTES (comanda.routes.js)
   - Identifica rota POST /:id/itens
   - Aplica middlewareAutenticacao
   - Roteia para ControladorComanda.adicionarItem

5. MIDDLEWARE (middlewareAutenticacao.js)
   - Extrai token do header
   - Verifica token com JWT
   - Se válido: adiciona req.usuario e chama next()
   - Se inválido: retorna 401

6. CONTROLLER (ControladorComanda.js)
   - Extrai dados: const { id } = req.params
   - Extrai body: const dados = req.body
   - Chama: ServicoComanda.adicionarItem(id, dados)

7. SERVICE (ServicoComanda.js)
   - Busca comanda no banco
   - Valida: está aberta?
   - Busca item do cardápio
   - Valida: existe? está ativo?
   - Cria ItemComanda no banco

8. MODEL (ItemComanda.js)
   - Sequelize cria registro no banco
   - Trigger 1 calcula subtotal
   - Trigger 2 atualiza total da comanda

9. BANCO DE DADOS (PostgreSQL)
   - INSERT em itens_comanda
   - Trigger atualiza comandas.valor_total

10. RETORNO
    Service → Controller → Cliente
    
11. CLIENTE
    Recebe: {
      sucesso: true,
      mensagem: "Item adicionado à comanda",
      dados: { ... }
    }
```

---

## 10. DECISÕES TÉCNICAS

### 10.1 Por que Sequelize (ORM)?

**Vantagens:**
- Abstração do SQL
- Migrations versionadas
- Validações no código
- Relacionamentos automáticos
- Proteção contra SQL Injection
- Suporte a múltiplos bancos

**Desvantagens:**
- Performance um pouco menor que SQL puro
- Curva de aprendizado
- Queries complexas podem ser difíceis

### 10.2 Por que JWT para autenticação?

**Vantagens:**
- Stateless (servidor não guarda sessão)
- Escalável (não precisa de memória compartilhada)
- Pode conter informações (payload)
- Padrão da indústria

**Desvantagens:**
- Não pode ser revogado facilmente
- Tamanho maior que session ID

### 10.3 Por que bcrypt para senhas?

**Vantagens:**
- Algoritmo lento (proteção contra brute force)
- Salt automático
- Amplamente testado e usado
- Impossível reverter

**Alternativas:**
- Argon2 (mais moderno, mas menos suportado)
- scrypt (similar ao bcrypt)

### 10.4 Por que soft delete (ativo = false)?

**Vantagens:**
- Mantém histórico
- Integridade referencial preservada
- Pode ser revertido
- Auditoria

**Desvantagens:**
- Queries precisam filtrar por ativo
- Ocupa mais espaço no banco

### 10.5 Por que separar em Services?

**Vantagens:**
- Lógica de negócio reutilizável
- Controllers ficam simples
- Fácil testar isoladamente
- Um service pode chamar outro

**Exemplo sem service (RUIM):**
```javascript
// Controller fazendo tudo
async criarUsuario(req, res) {
  const usuario = await Usuario.findOne({ where: { email } });
  if (usuario) return res.status(400).json({ erro: 'Existe' });
  const hash = await bcrypt.hash(senha, 10);
  const novo = await Usuario.create({ nome, email, senha: hash });
  res.json(novo);
}
```

**Exemplo com service (BOM):**
```javascript
// Controller
async criarUsuario(req, res) {
  try {
    const usuario = await ServicoUsuario.criar(req.body);
    res.json(usuario);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
}

// Service
async criar(dados) {
  // Todas as validações e lógica aqui
  // Pode ser reutilizado por outros controllers
}
```

### 10.6 Por que Triggers no banco?

**Vantagens:**
- Garantia de execução (sempre roda)
- Performance (processa no banco)
- Não depende de código aplicação
- Requisito da disciplina

**Desvantagens:**
- Lógica "escondida" no banco
- Difícil debugar
- Pode causar problemas de performance

### 10.7 Por que Stored Procedures para relatórios?

**Vantagens:**
- Performance em queries complexas
- Menos tráfego de rede
- Lógica de agregação no banco
- Requisito da disciplina

**Desvantagens:**
- Menos portável (específico do PostgreSQL)
- Difícil testar
- Código fora da aplicação

---

## CONCLUSÃO

Este backend foi construído seguindo boas práticas de arquitetura e desenvolvimento:

1. **Separação de responsabilidades**: Cada camada tem função clara
2. **Validações em múltiplas camadas**: Controllers, Services e banco
3. **Segurança**: JWT, bcrypt, validações
4. **Escalabilidade**: Arquitetura permite crescimento
5. **Manutenibilidade**: Código organizado e documentado
6. **Performance**: Triggers, stored procedures, índices
7. **Requisitos atendidos**: Migrations, triggers, procedures, ORM

### Próximos passos sugeridos:

1. Implementar testes automatizados (Jest)
2. Adicionar paginação nos endpoints de listagem
3. Implementar cache (Redis)
4. Adicionar rate limiting
5. Melhorar logs (Winston)
6. Adicionar monitoramento (New Relic, DataDog)
7. Deploy em produção (Render, Railway, Heroku)

---

Este documento serve como referência técnica completa do projeto. Para dúvidas específicas, consulte o código-fonte ou entre em contato com a equipe de desenvolvimento.

