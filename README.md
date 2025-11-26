# RestôDonte - Backend

Este é o repositório do backend e frontend para o aplicativo **RestôDonte**, o sistema de gerenciamento de comandas para restaurantes. Este projeto foi desenvolvido para o trabalho final das disciplinas de Programação II e Banco de Dados II.

O servidor é construído com **Node.js**, **Express**, e utiliza o **Sequelize** como ORM para se comunicar com um banco de dados **PostgreSQL**.

Para o desenvolvimento do frontend, utilizaremos **React Native** e **Expo** para criar uma aplicação móvel que se conecta a este backend.

## Visão rápida das rotas

- Todas as rotas do backend estão prefixadas por `/api`.
- Exemplos:
  - POST /api/autenticacao/login
  - POST /api/autenticacao/registrar
  - GET  /api/cardapio
  - GET  /api/comandas
  - GET  /api/producao/copa
  - GET  /api/producao/cozinha
  - GET  /api/relatorios/diario

Se o frontend se comunicar com o backend diretamente, ele deve usar a base URL do backend seguida de `/api` (por exemplo: `http://177.71.170.240:3000/api`).

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas na sua instância AWS (EC2):

- Node.js (versão 18+ recomendada)
- npm
- (opcional) pm2 para gerenciar o processo em produção

Além disso você precisa de uma instância de banco PostgreSQL (neste projeto usamos um endpoint RDS). Garanta que a EC2 consiga acessar o RDS (Security Groups e regras de firewall).

## Variáveis de ambiente (arquivo .env)

Na pasta `backend` crie um arquivo `.env` com as variáveis abaixo. Substitua pelos seus valores reais (não comite esse arquivo em repositórios públicos):

```env
# Banco de dados
DB_HOST=database-1.cbsi22a6wumh.sa-east-1.rds.amazonaws.com
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=restodonte

# Servidor
PORT=3000
HOST=0.0.0.0
INSTANCE_PUBLIC_IP=177.71.170.240

# Frontend (origem permitida para CORS em producao)
FRONTEND_URL=http://177.71.170.240:19006

# Segurança
JWT_SECRET=uma_string_secreta_forte
NODE_ENV=production
```

Observações:
- `DB_HOST` deve apontar para o endpoint do seu banco (ex.: RDS). No seu caso: `database-1.cbsi22a6wumh.sa-east-1.rds.amazonaws.com`.
- `FRONTEND_URL` é usado para configuração de CORS em ambiente de produção. Ajuste para a URL do seu frontend.
- `HOST=0.0.0.0` faz com que o servidor escute em todas as interfaces (necessário para acessar via IP público).

## Passo a passo: deploy na sua instância AWS (EC2)

Abaixo estão os comandos e etapas que você pode executar na sua instância EC2 para colocar o backend em funcionamento.

1. Clone o repositório e entre na pasta do backend

```bash
# ajuste o URL do repositório conforme necessário
git clone https://github.com/seu-usuario/restoDonte.git
cd restoDonte/backend
```

2. Instale dependências

```bash
npm install
```

3. Configure o arquivo `.env` conforme mostrado acima

```bash
nano .env
# cole as variáveis e salve
```

4. Testar acesso ao banco (opcional, recomendado)

Se `psql` estiver instalado, você pode testar a conexão direta ao RDS:

```bash
psql "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:5432/$DB_NAME"
```

Se a conexão falhar, verifique:
- Security Group do RDS (inbound rules): deve permitir conexões na porta 5432 a partir do IP/SG da sua EC2.
- Firewall local da EC2 (ufw/iptables) permitindo saída para a porta 5432.

5. Executar migrations e seeders

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

6. Abrir a porta no firewall da EC2 (exemplo usando ufw)

```bash
# permitir porta 3000 (ou a porta definida em PORT)
sudo ufw allow 3000/tcp
sudo ufw reload
```

Se você não usa `ufw`, ajuste as regras do seu firewall ou do Security Group da EC2.

7. Iniciar o backend (modo produção)

Opção simples (background com nohup):

```bash
NODE_ENV=production PORT=3000 HOST=0.0.0.0 npm start &
```

Opção recomendada (usando pm2):

```bash
npm install -g pm2
pm2 start npm --name restodonte-backend -- start
pm2 save
pm2 status
```

8. Verificar logs e endpoints

- Logs do pm2: `pm2 logs restodonte-backend`.
- Testar rota raiz:

```bash
curl http://177.71.170.240:3000/
```

- Testar rota do cardápio:

```bash
curl http://177.71.170.240:3000/api/cardapio
```

## Configuração do RDS e Security Groups (AWS)

- No console AWS, vá até RDS e selecione sua instância.
- Verifique o Security Group associado.
- Nas regras Inbound do Security Group do RDS, permita a porta 5432 com origem sendo o Security Group da sua EC2 (mais seguro) ou o IP público da EC2.
- Evite abrir o banco para 0.0.0.0/0.

## CORS e comunicação frontend → backend

- Em produção o backend usa a variável `FRONTEND_URL` para restringir origens.
- Garanta que o frontend faça chamadas para `http://177.71.170.240:3000/api` (ajuste a porta se diferente).
- Se estiver testando com o Expo em modo tunnel ou em IP diferente, atualize `FRONTEND_URL` no `.env` ou use ambiente de desenvolvimento (`NODE_ENV !== 'production'`) que aceita origens dinâmicas.

## Autenticação (JWT)

- Para endpoints protegidos, envie o header: `Authorization: Bearer <token>`.
- O token é gerado em `POST /api/autenticacao/login`.
- Mantenha `JWT_SECRET` seguro em produção.

## Testes com Postman / Insomnia

- Cole a URL base: `http://177.71.170.240:3000/api` e use os endpoints listados.
- Exemplo de login (body JSON):

```json
POST /api/autenticacao/login
{
  "email": "admin@restodonte.com",
  "senha": "admin123"
}
```

- Copie o token e inclua no header `Authorization: Bearer <token>` para endpoints protegidos.

## Melhorias recomendadas para produção

- Colocar o backend atrás de um proxy reverso (nginx) e configurar HTTPS com Let's Encrypt.
- Manter as credenciais do banco e `JWT_SECRET` em um cofre de segredos (AWS Secrets Manager, Parameter Store, etc.) em vez de `.env` em texto plano.
- Usar logs centralizados (CloudWatch) e monitoramento (pm2 + métricas ou serviços externos).

## Scripts úteis

- `npm run dev` — Inicia o servidor com nodemon (desenvolvimento).
- `npm start` — Inicia o servidor (produção).
- `npx sequelize-cli db:migrate` — Aplica migrations.
- `npx sequelize-cli db:seed:all` — Executa seeders.

## Estrutura do Projeto

```
src/
├── config/         # Arquivos de configuração (banco de dados, etc.)
├── controllers/    # Controladores (lógica de requisição e resposta HTTP)
├── database/       # Migrations e Seeders do Sequelize
├── models/         # Modelos do Sequelize (representação das tabelas)
├── routes/         # Definição das rotas da API
|── seeders/        # dados iniciais para popular o banco
└── services/       # Camada de serviço (regras de negócio)
```

## Fluxo de trabalho (branches e PR)

Siga o fluxo já descrito no projeto: trabalhar em branches (`feature/`, `fix/`) e abrir Pull Requests para revisão antes de mesclar na `main`.

---

Se quiser, eu atualizo também um arquivo `.env.example` no repositório e adiciono um script `deploy-check.sh` que executa verificações básicas (conexão DB, porta aberta, rotas principais respondendo). Deseja que eu adicione esses arquivos agora?
