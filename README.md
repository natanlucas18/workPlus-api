# WorkPlus-api
Api para sistema SaaS de gerenciamento de lançamentos extras, desenvolvido com foco em escalabilidade, auditoria, automação e usabilidade para pequenos e médios negócios.
### Sobre o Projeto
O WorkPlus-api é uma api completa para gerenciamento de lançamentos extras que surgiu da ideia de centralizar as informações em um único lugar
e facilitar fazer auditorias com essas informações, muitas empresas de pequeno e médio porte no vale do são francisco ainda utilizam excel ou notas
para fazer as anotações de lançamentos extras dos funcionários. A minha ideia é criar um Sistema SaaS web para ajudar na organização dessas informações.

### Arquitetura
O projeto segue uma arquitetura baseada em separação clara de responsabilidades:
Multi-ternant
API REST
Autenticação com JWT (Access + Refresh Token)
Cookies httpOnly para segurança

### Tecnologias Utilizadas
  - NestJs
  - TypeORM
  - PostgreSQL
  - Docker
  - Swagger

### Funcionalidades
Gestão de funcionários, estações de trabalho, lançamentos
Controle de lançamentos por período de pagamento. ex: OUTUBRO/2026
Histórico de lançamentos, períodos de pagamento
Notificações informando quando um período de pagamento foi aberto ou fechado
- Relatórios com exportação em PDF e excel
- RBAC (Role-Based Access Control)
- Tokens armazenados em cookies httpOnly
- Separação entre Access Token e Refresh Token
- Boas práticas para evitar exposição de dados sensíveis

### Como rodar o projeto
      npm install
      npm run start:dev

### Como rodar testes
     npm run test:watch

### Roadmap
  - Dashboard com métricas
  - Receber notificações automáticas Período de pagamento aberto/fechado
  - Gerar relatórios (PDF)
  - Imprimir etiquetas com rastreabilidade
 
### Possíveis Casos de Uso
  Pequenas e médias empresas do ramo agrícola do vale do são francisco.
