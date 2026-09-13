# Corretor Dantas

Sistema web para gerenciamento e divulgação de imóveis, desenvolvido como projeto pessoal com foco em boas práticas de desenvolvimento, segurança e organização de uma aplicação full-stack.

O projeto está sendo desenvolvido utilizando Java e Spring Boot no back-end e React no front-end, com PostgreSQL como banco de dados.


---

## 📋 Sobre o projeto

O **Corretor Dantas** tem como objetivo fornecer uma plataforma para um corretor de imóveis gerenciar seus imóveis e disponibilizá-los para consulta por clientes.

A aplicação está sendo construída com uma arquitetura separando front-end e back-end, permitindo uma evolução independente de cada parte do sistema.

Entre os objetivos do projeto estão:

- Cadastro e gerenciamento de usuários;
- Autenticação segura;
- Gerenciamento de imóveis;
- Consulta e filtragem de imóveis;
- Controle de permissões;
- Interface web responsiva;
- Integração entre React e uma API REST;
- Persistência dos dados utilizando PostgreSQL.

---

## 🛠️ Tecnologias utilizadas

### Back-end

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- BCrypt
- Bean Validation
- PostgreSQL
- Maven
- Lombok

### Front-end

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

---

## 🏗️ Estrutura do projeto

```text
Corretor-Dantas/
│
├── corretor-dantas-api/        # API REST - Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── corretor-dantas-web/        # Interface - React
│   ├── src/
│   ├── package.json
│   └── ...
│
└── .gitignore
