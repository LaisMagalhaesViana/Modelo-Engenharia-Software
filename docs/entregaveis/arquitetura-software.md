# 📄 Documento de Arquitetura de Software

---

## 1. Introdução

### 1.1 Propósito

Este documento tem como objetivo apresentar a arquitetura do software **Sistema de Controle de Despesas Pessoais (SCDP)**, descrevendo as principais decisões arquiteturais adotadas, bem como as tecnologias e padrões utilizados no desenvolvimento do sistema.

O documento serve como guia para a equipe de desenvolvimento, garantindo padronização, organização e qualidade durante a implementação do projeto.

---

### 1.2 Escopo

O **Sistema de Controle de Despesas Pessoais (SCDP)** é uma aplicação web desenvolvida com o objetivo de permitir que usuários registrem, organizem e acompanhem suas movimentações financeiras de forma simples e eficiente.

A solução contempla funcionalidades como:

- Cadastro e autenticação de usuários  
- Registro de receitas e despesas  
- Categorização de gastos  
- Visualização de saldo  

Este documento abrange a definição da arquitetura do sistema, incluindo:

- Organização em camadas  
- Tecnologias adotadas  
- Diretrizes técnicas a serem seguidas pela equipe  

---

## 2. Visão Geral da Arquitetura

### 2.1 Sumário da Arquitetura

O sistema será desenvolvido utilizando uma **arquitetura em camadas**, com o objetivo de promover separação de responsabilidades (*Separation of Concerns*), facilitar a manutenção e permitir escalabilidade.

---

### 🔧 Backend

Será utilizado o framework **NestJS**, com organização modular e divisão em camadas:

- **Controllers** → recebem requisições HTTP  
- **Services** → implementam regras de negócio  
- **Repositories / ORM (Prisma)** → acesso e manipulação de dados  

---

### 💻 Frontend

- Aplicação web independente  
- Responsável pela interface com o usuário  
- Consome a API do backend  

---

### 🔗 Comunicação

A comunicação entre frontend e backend será realizada por meio de uma **API REST**, utilizando:

- `GET`
- `POST`
- `PUT`
- `DELETE`

---

### 2.2 Metas e Restrições

#### 🎯 Metas Arquiteturais

- Garantir uma arquitetura simples e de fácil manutenção  
- Promover separação clara de responsabilidades  
- Facilitar escalabilidade futura  
- Assegurar organização e padronização do código  
- Permitir integração eficiente entre frontend e backend  

---

#### ⚙️ Restrições Técnicas

- **Linguagens:** JavaScript, TypeScript, SQL  
- **Backend:** NestJS  
- **ORM:** Prisma  
- **Banco de Dados:** PostgreSQL (Supabase)  
- **Frontend:** React + Vite  
- **Estilização:** Tailwind CSS + shadcn/ui  
- **Gerenciamento de estado:** React Query  
- **Deploy:** Vercel  
- **Idioma:** Português  
- **Prazo:** Projeto acadêmico com tempo limitado  
- **Equipe:**  
  - 2 Desenvolvedores = Sinval Luz e Guilherme Almeida 
  - 1 Scrum Master  = Edu Guerreiro
  - 1 Product Owner = Laís Viana

---

## 🧱 Visão Estrutural (Resumo)
Frontend (React)
↓
API REST (HTTP)
↓
Backend (NestJS)
├── Controllers
├── Services
└── Prisma (ORM)
↓
Banco de Dados (PostgreSQL - Supabase)


---

## 📌 Observações

- A arquitetura foi definida visando simplicidade e evolução gradual  
- O sistema poderá sofrer ajustes conforme evolução das sprints  
- Este documento deve ser atualizado conforme decisões arquiteturais futuras  