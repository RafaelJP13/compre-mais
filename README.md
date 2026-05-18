## CompreFlow 🛒

A modern Retail Execution + Pricing Intelligence + Sales Intelligence platform built with React.js, React Native and NestJS is a multi-tenant B2B SaaS solution built for companies that need to centralize, automate, and scale their operations with security, reliability, and high performance. Inspired by enterprise-grade infrastructures, the platform delivers a complete ecosystem for business management, operational monitoring, and real-time strategic insights.

The solution enables employees to register purchases, sales, and operational activities directly through the mobile application, instantly sending all data to the management dashboard. This provides business leaders with a unified, real-time view of operations, performance metrics, and company activities from anywhere.

Built with a modern and scalable architecture, the platform supports multiple companies within a single environment while maintaining complete data isolation and security for each client. In addition, it offers intelligent dashboards, customizable reports, user and permission management, operational auditing, inventory management, product control, and sales tracking — creating a complete infrastructure for companies looking to digitize processes and improve operational efficiency.

Learn more: 👉 [Visit Compre Flow](https://institucional-compre-flow.vercel.app/)

<div align="center">

<img src="/docs/proposito.png" width="1000"/>

</div>

---

# 🚀 About the Project

Compre Mais is a Pricing and Salesforce application focused on scalability, organization, and clean architecture.

The project aims to simulate a modern Pricing and Salesforce experience with:

- Scalability
- Authentication
- REST API Integration
- GraphQL integration
- Modular backend architecture
- Modern frontend

This repository contains both frontend( Web | Mobile) and backend applications.

---

# 🧰 Technologies

## Frontend

- React.js
- Next.js
- TypeScript
- Tailwind CSS

## Backend

- NestJS
- TypeScript
- Prisma
- Rest API's
- GraphQL

---

# 📁 Project Structure

```bash
compre-mais/
├── backend/            # NestJS API
├── dashboard-empresas/ # Next.js application
├── frontend/           # React.js application
├── infra/              # Infra
├── mobile/             # Mobile
```

---

# ⚙️ Getting Started

## Clone the repository

```bash
git clone https://github.com/RafaelJP13/compre-flow.git
```

---


# 🔧 Setup

The backend requires a `.env` and `.env` file in the root directory. ( REFACTOR ) 

```bash
JWT_SECRET="CHANGE_THIS_TO_A_LONG_RANDOM_SECRET"
PORT=3000
NODE_ENV=development

POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
POSTGRES_URL="postgresql://postgres:user@password:5432/compre-flow"

```

After that runs the command

```bash
docker compose up --build
```

---

## 👤 Default User (Seed)

After running the docker compose, a default user will be created for testing purposes:

```json
{
  "name": "Platform Owner",
  "email": "owner@test.com",
  "password": "123456"
}
```

---

Backend will run on:

```bash
http://localhost:3000
```
Frontend will run on:

```bash
http://localhost:5173
```

---

# 📌 Features

- [x] NestJS backend initialization
- [x] Frontend with React.js
- [x] Login & Logout
- [x] Admin Dashboard
- [x] Authentication with JWT in HttpOnly cookies 
- [x] Unit Tests
- [x] CI & CD
- [x] Add React Router
- [x] REST API for crud
- [x] Unit Tests
- [x] Snyk to scan the dependencies
- [x] Company Dashboard with Next.js
- [ ] Demonstrating Proof of Possession (DPoP) in Company Dashboard
- [ ] UI Componentization
- [ ] Permission-Based Access Control (PBAC) 
- [ ] Company Dashboard
- [ ] GraphQL for dashboards, aggregations, complex frontend querying
- [ ] Company crud
- [ ] Employers Company crud 
- [ ] Internal users crud


---

# 🧠 Learning Goals

This project was created to improve skills in:

- Node.js Ecossystem
- Fullstack development
- Backend architecture with NestJS
- API design
- Scalable project organization
- Modern frontend development with React.js and Next.js
- CI/CD pipeline
- Unit, e2e and integration tests
- Websockets
---

# 📄 License

This project is licensed under the GNU General Public License v3.0.
