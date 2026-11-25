### Projeto My Way | Desenvolvimento de Sistemas para Dispositivos Móveis

**Disciplina:** Desenvolvimento de Sistemas para Dispositivos Móveis | Centro Universitário SENAC<br>
**Orientador:** Prof. Orlando Clinio Patriarcha

**Desenvolvido por:** André Rodrigues

---

<!-- Insira aqui o logo do projeto: <img width="187" height="187" alt="Logo do My Way" src="URL_DO_LOGO" /> -->

# My Way

> Documentação do projeto **My Way**, um aplicativo mobile para organizar os cursos, certificações, aulas, workshops e outros estudos que o usuário deseja realizar, acompanhando o progresso de cada um.

---

## 1. Visão Geral

### 1.1 Descrição do Projeto

O **My Way** é um aplicativo mobile de controle de cursos e certificados. Quem estuda por conta própria ou busca qualificação profissional costuma guardar links, anotações e prazos em lugares diferentes, o que dificulta saber o que fazer primeiro, quanto já foi concluído e o que ainda está pendente.

O aplicativo reúne esses itens de estudo em um só lugar. O usuário cria suas próprias categorias, define prioridade e prazo para cada item, registra as horas realizadas e acompanha o progresso em horas e em porcentagem.

### 1.2 Integrantes

| Integrante      | GitHub                                    |
| --------------- | ----------------------------------------- |
| André Rodrigues | [oandredev](https://github.com/oandredev) |

---

## 2. Objetivos e Público-Alvo

O objetivo principal do projeto é oferecer uma ferramenta mobile simples para planejar e acompanhar estudos, permitindo que o usuário saiba o que pretende fazer, o que está em andamento e o que já concluiu.

O público-alvo é composto por estudantes e profissionais que desejam organizar sua formação, desde uma aula avulsa até uma graduação. A experiência de uso deve ser objetiva, com as informações mais importantes visíveis na tela inicial.

---

## 3. Funcionalidades

- **Cadastro e login de usuários:** o acesso às funções do aplicativo depende de um usuário cadastrado e autenticado.
- **Tela inicial com resumo:** a Home apresenta uma visão geral dos itens de estudo, com botões para as telas de criação e edição.
- **Filtros por categoria:** os filtros ficam sempre visíveis no topo da Home.
- **Pesquisa:** um campo de busca permite localizar itens de estudo.
- **Categorias personalizadas:** o usuário cria categorias com nome e cor, escolhida entre cerca de 10 cores principais.
- **Gerenciamento de itens de estudo:** cadastro, visualização, edição e exclusão de cursos, certificações, graduações, aulas, workshops e outros.
- **Prioridade e prazo:** cada item pode ser organizado por prioridade e data limite.
- **Acompanhamento de progresso:** o avanço é exibido em horas e em porcentagem, e o status é calculado automaticamente.
- **Tema claro e escuro:** a interface oferece os dois modos de exibição.

### 3.1 Telas

| Tela                | Descrição                                                                     |
| ------------------- | ----------------------------------------------------------------------------- |
| Login               | Autenticação do usuário                                                       |
| Cadastro de usuário | Criação de uma nova conta                                                     |
| Home                | Resumo, filtros de categoria, pesquisa e lista de itens de estudo             |
| Item de estudo      | Criação, edição e exclusão de um item (internamente como soft delete)         |
| Categorias          | Criação,edição e exclusão de categorias e suas cores (internamente como soft) |

---

## 4. Escopo

O escopo do projeto é o planejamento e o acompanhamento dos estudos do próprio usuário. O aplicativo não se propõe a hospedar conteúdo de cursos, realizar matrículas, nem emitir ou validar certificados. Não há perfis múltiplos nem avatar: cada conta representa um único usuário.

---

## 5. Requisitos

### Funcionais

| ID   | Nome do RF                       | Descrição                                                                              |
| ---- | -------------------------------- | -------------------------------------------------------------------------------------- |
| RF01 | Entrada de usuário               | Permitir o cadastro e o login de usuários.                                             |
| RF02 | Gerenciamento de categorias      | Criar, listar, editar e excluir categorias com nome e cor. O nome é único por usuário. |
| RF03 | Gerenciamento de itens de estudo | Criar, listar, editar e excluir itens com tipo, categoria, prioridade, prazo e horas.  |
| RF04 | Acompanhamento de progresso      | Exibir o progresso em horas e porcentagem e calcular o status a partir das horas.      |
| RF05 | Resumo, filtro e pesquisa        | Exibir um resumo na Home, filtrar por categoria e pesquisar itens.                     |
| RF06 | Tema                             | Permitir o uso do aplicativo em tema claro ou escuro.                                  |

### Não funcionais

| RNF | Característica | Subcaracterística      | Descrição                                                                      |
| --- | -------------- | ---------------------- | ------------------------------------------------------------------------------ |
| 1   | Segurança      | Autenticação JWT       | O acesso à API é autenticado por token com data de expiração.                  |
|     |                | Criptografia de senhas | As senhas são armazenadas com hash BCrypt.                                     |
|     |                | Isolamento de dados    | Cada usuário acessa e altera somente os próprios registros.                    |
|     |                | DTOs                   | A entrada e a saída de dados da API usam DTOs implementados como `records`.    |
| 2   | Usabilidade    | Navegação              | Os filtros de categoria permanecem visíveis no topo da Home.                   |
|     |                | Temas                  | Os temas claro e escuro devem manter textos e componentes legíveis.            |
| 3   | Arquitetura    | Comunicação            | O front-end consome uma API REST.                                              |
|     |                | Estado                 | O aplicativo utiliza gerenciamento de estado.                                  |
|     |                | Armazenamento local    | O AsyncStorage guarda dados locais, como o token de acesso e o tema escolhido. |
|     |                | Persistência           | Os dados são armazenados em banco de dados relacional.                         |

---

## 6. Tecnologias Adotadas

### 6.1 Front-end Mobile

O aplicativo é desenvolvido com [React Native](https://reactnative.dev/), utilizando:

- **Linguagem:** JavaScript
- **Armazenamento local:** [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) e Expo-Secure

### 6.2 Back-end e Banco de Dados

O back-end é uma API REST desenvolvida em [Java](https://docs.oracle.com/en/java/) com [Spring Boot](https://spring.io/projects/spring-boot), com autenticação JWT. Ela recebe, processa e armazena as informações enviadas pelo aplicativo em um banco de dados relacional: **H2 Database**.

---

## 7. Modelagem de Dados

A modelagem possui três tabelas. Todas têm os campos `createdAt` e `modifiedAt`. No UniModeler, as chaves estrangeiras seguem o formato `'#user_id': "user.id"`.

### 7.1 `user`

| Campo                      | Descrição                       |
| -------------------------- | ------------------------------- |
| `id`                       | Chave primária                  |
| `name`                     | Nome do usuário                 |
| `email`                    | E-mail usado no login           |
| `password`                 | Hash da senha                   |
| `active`                   | Indica se o registro está ativo |
| `createdAt` / `modifiedAt` | Datas de criação e modificação  |

### 7.2 `category`

| Campo                      | Descrição                            |
| -------------------------- | ------------------------------------ |
| `id`                       | Chave primária                       |
| `#user_id`                 | Chave estrangeira para `user.id`     |
| `name`                     | Nome da categoria, único por usuário |
| `colorId`                  | Número que identifica a cor          |
| `active`                   | Controle de exclusão lógica          |
| `createdAt` / `modifiedAt` | Datas de criação e modificação       |

### 7.3 `study_item`

| Campo                      | Descrição                                                                |
| -------------------------- | ------------------------------------------------------------------------ |
| `id`                       | Chave primária                                                           |
| `#user_id`                 | Chave estrangeira para `user.id`                                         |
| `#categoryId`              | Chave estrangeira para `category.id`                                     |
| `type`                     | `COURSE`, `CERTIFICATION`, `GRADUATION`, `LESSON`, `WORKSHOP` ou `OTHER` |
| `priority`                 | Prioridade do item                                                       |
| `deadline`                 | Prazo para conclusão                                                     |
| `totalHours`               | Carga horária total                                                      |
| `doneHours`                | Horas já realizadas                                                      |
| `status`                   | `TODO`, `IN_PROGRESS` ou `DONE`                                          |
| `completedAt`              | Data de conclusão                                                        |
| `active`                   | Controle de exclusão lógica                                              |
| `createdAt` / `modifiedAt` | Datas de criação e modificação                                           |

---

### 8. Endpoints

As rotas marcadas com autenticação exigem o token JWT no cabeçalho `Authorization: Bearer <token>`.

#### Usuário

| Método | Rota             | Autenticação | Corpo da requisição     | Resposta             | Descrição                                                          |
| ------ | ---------------- | ------------ | ----------------------- | -------------------- | ------------------------------------------------------------------ |
| `POST` | `/user/signup`   | Não          | `SignupRequest`         | `201` `UserResponse` | Cadastra um usuário                                                |
| `POST` | `/user/login`    | Não          | `LoginRequest`          | `200` `UserResponse` | Autentica o usuário e retorna o token no cabeçalho `Authorization` |
| `PUT`  | `/user`          | Sim          | `UpdateUserRequest`     | `200` `UserResponse` | Atualiza os dados do usuário autenticado                           |
| `PUT`  | `/user/password` | Sim          | `UpdatePasswordRequest` | `200` `UserResponse` | Atualiza a senha do usuário autenticado                            |

#### Categorias

| Método | Rota                   | Autenticação | Corpo da requisição          | Resposta                            | Descrição                             |
| ------ | ---------------------- | ------------ | ---------------------------- | ----------------------------------- | ------------------------------------- |
| `POST` | `/study-category`      | Sim          | `StudyCategoryCreateRequest` | `201` `StudyCategoryResponse`       | Cria uma categoria                    |
| `GET`  | `/study-category`      | Sim          | —                            | `200` `List<StudyCategoryResponse>` | Lista as categorias ativas do usuário |
| `PUT`  | `/study-category/{id}` | Sim          | `StudyCategoryUpdateRequest` | `200` `StudyCategoryResponse`       | Atualiza ou desativa uma categoria    |

#### Itens de estudo

| Método | Rota               | Autenticação | Corpo da requisição      | Resposta                        | Descrição                        |
| ------ | ------------------ | ------------ | ------------------------ | ------------------------------- | -------------------------------- |
| `POST` | `/study-item`      | Sim          | `StudyItemCreateRequest` | `201` `StudyItemResponse`       | Cria um item de estudo           |
| `GET`  | `/study-item`      | Sim          | —                        | `200` `List<StudyItemResponse>` | Lista os itens ativos do usuário |
| `PUT`  | `/study-item/{id}` | Sim          | `StudyItemUpdateRequest` | `200` `StudyItemResponse`       | Atualiza ou desativa um item     |

A exclusão de categorias e itens é lógica (_soft delete_): o registro é atualizado com `active = false` e deixa de aparecer nas listagens.

> **Observação:** informações mais específicas sobre a API podem ser acessadas e testadas pelo [Swagger](http://localhost:8080/swagger-ui/index.html), com o back-end em execução.
