# Documentação da API - RestôDonte

## Base URL
```
http://localhost:3000
```

## Endpoints Gerais

### Health Check
Verifica se a API está funcionando.

```http
GET /health
```

**Resposta de Sucesso (200)**
```json
{
  "status": "OK",
  "message": "RestôDonte API está funcionando!",
  "timestamp": "2024-11-06T17:52:35.123Z"
}
```

### Informações da API
```http
GET /
```

**Resposta de Sucesso (200)**
```json
{
  "message": "Bem-vindo à API RestôDonte",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "api": "/api"
  }
}
```

---

## 🪑 Mesas (Tables)

### Listar Mesas
Lista todas as mesas do restaurante.

```http
GET /api/mesas
```

**Query Parameters (Opcionais)**
- `status`: Filtrar por status (`livre`, `ocupada`, `reservada`)

**Exemplo de Requisição**
```bash
curl http://localhost:3000/api/mesas?status=livre
```

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero": 1,
      "capacidade": 2,
      "status": "livre",
      "createdAt": "2024-11-06T17:52:35.123Z",
      "updatedAt": "2024-11-06T17:52:35.123Z"
    },
    {
      "id": 2,
      "numero": 2,
      "capacidade": 4,
      "status": "ocupada",
      "createdAt": "2024-11-06T17:52:35.123Z",
      "updatedAt": "2024-11-06T17:52:35.123Z"
    }
  ],
  "count": 2
}
```

---

### Buscar Mesa por ID
Retorna os detalhes de uma mesa específica.

```http
GET /api/mesas/:id
```

**Path Parameters**
- `id`: ID da mesa (inteiro)

**Exemplo de Requisição**
```bash
curl http://localhost:3000/api/mesas/1
```

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero": 1,
    "capacidade": 2,
    "status": "livre",
    "createdAt": "2024-11-06T17:52:35.123Z",
    "updatedAt": "2024-11-06T17:52:35.123Z"
  }
}
```

**Resposta de Erro (404)**
```json
{
  "success": false,
  "error": "Mesa não encontrada"
}
```

---

### Criar Nova Mesa
Cria uma nova mesa no sistema.

```http
POST /api/mesas
```

**Body Parameters**
```json
{
  "numero": 11,
  "capacidade": 4,
  "status": "livre"
}
```

**Campos**
- `numero` (obrigatório): Número da mesa (inteiro, único)
- `capacidade` (obrigatório): Capacidade de pessoas (inteiro, mínimo 1)
- `status` (opcional): Status da mesa - `livre`, `ocupada`, ou `reservada` (padrão: `livre`)

**Exemplo de Requisição**
```bash
curl -X POST http://localhost:3000/api/mesas \
  -H "Content-Type: application/json" \
  -d '{
    "numero": 11,
    "capacidade": 4,
    "status": "livre"
  }'
```

**Resposta de Sucesso (201)**
```json
{
  "success": true,
  "message": "Mesa criada com sucesso",
  "data": {
    "id": 11,
    "numero": 11,
    "capacidade": 4,
    "status": "livre",
    "createdAt": "2024-11-06T17:52:35.123Z",
    "updatedAt": "2024-11-06T17:52:35.123Z"
  }
}
```

**Resposta de Erro (409) - Número duplicado**
```json
{
  "success": false,
  "error": "Erro ao criar mesa",
  "message": "Já existe uma mesa com este número"
}
```

**Resposta de Erro (400) - Validação**
```json
{
  "success": false,
  "error": "Erro ao criar mesa",
  "message": "O número da mesa deve ser maior que zero"
}
```

---

### Atualizar Mesa
Atualiza os dados de uma mesa existente.

```http
PUT /api/mesas/:id
```

**Path Parameters**
- `id`: ID da mesa (inteiro)

**Body Parameters**
```json
{
  "numero": 12,
  "capacidade": 6,
  "status": "ocupada"
}
```

Todos os campos são opcionais. Apenas os campos fornecidos serão atualizados.

**Exemplo de Requisição**
```bash
curl -X PUT http://localhost:3000/api/mesas/11 \
  -H "Content-Type: application/json" \
  -d '{
    "capacidade": 6,
    "status": "ocupada"
  }'
```

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Mesa atualizada com sucesso",
  "data": {
    "id": 11,
    "numero": 11,
    "capacidade": 6,
    "status": "ocupada",
    "createdAt": "2024-11-06T17:52:35.123Z",
    "updatedAt": "2024-11-06T18:00:00.000Z"
  }
}
```

---

### Alterar Status da Mesa
Altera apenas o status de uma mesa (operação mais comum).

```http
PATCH /api/mesas/:id/status
```

**Path Parameters**
- `id`: ID da mesa (inteiro)

**Body Parameters**
```json
{
  "status": "ocupada"
}
```

**Status válidos**: `livre`, `ocupada`, `reservada`

**Exemplo de Requisição**
```bash
curl -X PATCH http://localhost:3000/api/mesas/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "ocupada"}'
```

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Status da mesa atualizado com sucesso",
  "data": {
    "id": 1,
    "numero": 1,
    "capacidade": 2,
    "status": "ocupada",
    "createdAt": "2024-11-06T17:52:35.123Z",
    "updatedAt": "2024-11-06T18:00:00.000Z"
  }
}
```

**Resposta de Erro (400) - Status inválido**
```json
{
  "success": false,
  "error": "Erro ao alterar status",
  "message": "Status inválido. Use: livre, ocupada ou reservada"
}
```

---

### Deletar Mesa
Remove uma mesa do sistema.

```http
DELETE /api/mesas/:id
```

**Path Parameters**
- `id`: ID da mesa (inteiro)

**Exemplo de Requisição**
```bash
curl -X DELETE http://localhost:3000/api/mesas/11
```

**Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Mesa deletada com sucesso"
}
```

**Resposta de Erro (400) - Mesa ocupada**
```json
{
  "success": false,
  "error": "Erro ao deletar mesa",
  "message": "Não é possível deletar uma mesa ocupada"
}
```

**Resposta de Erro (404)**
```json
{
  "success": false,
  "error": "Erro ao deletar mesa",
  "message": "Mesa não encontrada"
}
```

---

## 📝 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Erro na requisição (validação) |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito (ex: número de mesa duplicado) |
| 500 | Internal Server Error - Erro no servidor |

---

## 🔄 Formato de Resposta Padrão

### Sucesso
```json
{
  "success": true,
  "data": { ... },
  "message": "Mensagem opcional"
}
```

### Erro
```json
{
  "success": false,
  "error": "Tipo de erro",
  "message": "Descrição detalhada do erro"
}
```

---

## 📋 Endpoints Futuros (A Implementar)

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Criar cliente
- `GET /api/clientes/:id` - Buscar cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Deletar cliente

### Menu
- `GET /api/menu` - Listar itens do menu
- `POST /api/menu` - Adicionar item ao menu
- `GET /api/menu/:id` - Buscar item
- `PUT /api/menu/:id` - Atualizar item
- `DELETE /api/menu/:id` - Remover item

### Comandas
- `GET /api/comandas` - Listar comandas
- `POST /api/comandas` - Abrir comanda
- `GET /api/comandas/:id` - Buscar comanda
- `POST /api/comandas/:id/fechar` - Fechar comanda
- `GET /api/comandas/mesa/:mesaId` - Comandas de uma mesa

### Pedidos
- `POST /api/comandas/:comandaId/pedidos` - Adicionar pedido à comanda
- `GET /api/comandas/:comandaId/pedidos` - Listar pedidos da comanda
- `DELETE /api/pedidos/:id` - Cancelar pedido

### Pagamentos
- `POST /api/comandas/:comandaId/pagamento` - Registrar pagamento
- `GET /api/pagamentos` - Histórico de pagamentos

---

**Versão da API**: 1.0.0  
**Última Atualização**: Novembro 2024
