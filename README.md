# System-radio-Capital
Aplicativo SPA/PWA no qual irá realizar todo o controle dos contratos dos investidores.7

# Docker
docker-compose up -d : Instalar dependências caso não exista e rodar images em background
docker-compose stop : para imagens

# Back end
cd .\backend\
yarn install

# Rename
.env.development.local.example for .env.development.local
Maybe should the sequelize rename to .env

# DB
cd .\backend\
yarn sql_migration (Executar as migrations)
yarn sql_seed_all (Dump de registros)

-- No o .env.development.local
yarn cross-env NODE_ENV=development sequelize db:migrate
yarn cross-env NODE_ENV=development sequelize db:seed:all

-- No .env
yarn sequelize db:migrate
yarn sequelize db:seed:all

# Start
yarn start

# Front end
cd .\frontend\
yarn install

# Start
yarn start

# App
Para logar no aplicativo basta apenas pegar um usuário na tabela users do banco de dados.

O login é o e-mail de usuário e a senha é o número que existe no e-mail.

Ex.: Login: "consultant_37986@gmail.com" Senha: 37986