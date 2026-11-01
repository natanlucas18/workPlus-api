# WorkPlus-api
API REST para uma plataforma SaaS de gerenciamento de lançamentos extras de funcionários, desenvolvida com NestJS e PostgreSQL.

O WorkPlus tem como objetivo centralizar o controle de lançamentos extras, facilitar auditorias e proporcionar maior organização e rastreabilidade das informações empresariais.
### Sobre o Projeto
O WorkPlus surgiu da necessidade de modernizar o gerenciamento de lançamentos extras de funcionários em pequenas e médias empresas.

Muitas empresas ainda utilizam planilhas, anotações físicas ou processos manuais para registrar essas informações, dificultando o acompanhamento, a organização e a auditoria dos lançamentos.

A proposta é oferecer uma solução SaaS que centralize essas operações em uma plataforma segura, organizada e acessível.

### Arquitetura
O projeto utiliza uma arquitetura modular baseada na separação de responsabilidades, com foco em manutenibilidade, segurança e escalabilidade.

Principais características:

Multi-tenant: isolamento de dados por empresa.

API REST: endpoints organizados por módulos e responsabilidades.

Autenticação JWT: utilização de Access Token e Refresh Token.

Segurança: armazenamento de tokens em cookies HttpOnly.

Autorização RBAC: controle de acesso baseado em papéis.

Persistência: PostgreSQL com TypeORM.

### Tecnologias Utilizadas
  - NestJs
  - TypeScript
  - TypeORM
  - Migrations
  - PostgreSQL
  - Docker
  - Swagger
  - Jest

### Funcionalidades

#### Gestão empresarial

  - Gerenciamento de empresas.

  - Controle de usuários e permissões.

  - Isolamento de dados entre empresas.

#### Gestão de funcionários

  - Cadastro e gerenciamento de funcionários.

  - Associação de funcionários às respectivas empresas.

  - Controle de estações de trabalho.

#### Lançamentos extras

  - Cadastro e gerenciamento de lançamentos.

  - Associação dos lançamentos aos funcionários.

  - Organização por períodos de pagamento.

  - Histórico de lançamentos.

#### Períodos de pagamento

  - Abertura e fechamento de períodos.

  - Controle dos lançamentos vinculados a cada período.

  - Notificações sobre alterações no status dos períodos.

#### Segurança e controle de acesso

  - Autenticação JWT.

  - Access Token e Refresh Token.

  - Cookies HttpOnly.

  - RBAC (Role-Based Access Control).

  - Isolamento de dados por empresa.

### Como executar o projeto
#### Pré-requisitos
  - Node.js
  - npm
  - PostgreSQL
  - Docker(opcional)

#### Instalação
 ##### Clone o repositório:
      git clone https://github.com/natanlucas18/workPlus-api.git

##### Entre na pasta:
      cd workPlus-api

##### Instale as dependências:
      npm install

### Configuração das variáveis de ambiente
##### Crie um arquivo .env na raiz do projeto e configure as variáveis necessárias.
      DATABASE_HOST=localhost
      DATABASE_PORT=5432
      DATABASE_USERNAME=seu_usuario
      DATABASE_PASSWORD=sua_senha
      DATABASE_DATABASE=workplus

      JWT_SECRET=sua_chave_secreta
      JWT_REFRESH_SECRET=sua_chave_refresh

### Executando a aplicação
    npm run start:dev

### Testes
##### Para executar testes automatizados:
      npm run test

##### Para executar testes automatizados em modo de observação:
      npm run test:watch

### Documentação da API
##### A documentação dos endpoints é disponibilizada através do Swagger.

##### Após iniciar a aplicação, acesse:
      http://localhost:3000/api/v1/docs

### Roadmap
  - Dashboard com métricas e indicadores.
  - Sistema de notificações automáticas.
  - Geração de relatórios em PDF e Excel.
  - Melhorias na auditoria e histórico de operações.
 
### Publico-alvo
  Pequenas e médias empresas, especialmente do setor agrícola do Vale do São Francisco, que
  necessitam de maior controle e organização dos lançamentos extras de seus funcionários.

### Autor
Desenvolvido por Natan.


