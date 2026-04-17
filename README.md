# Adventure Book Web Application

## 🚀 What is this?
A technical assessment project for a choose-your-own-adventure web app, with a React frontend and a Spring Boot backend API. It lets users browse books, play branching stories, and navigate sections based on choices.

## 🎯 Problem it solves
This project demonstrates how to model and deliver interactive branching narratives through a web UI and API.
It exists to evaluate end-to-end engineering skills: data modeling, API integration, state management, and gameplay validation.

## ✨ Key Features
- Browse an adventure library with search, sorting, and filters (difficulty, type, tags).
- Play story sections with branching choices and consequence-based HP updates.
- Validate book structure before gameplay (single BEGIN, reachable END, valid option targets).
- Track run progress (visited vs reachable sections) and support restart/pause flows.
- Call a backend endpoint to save progress from the game screen.

## 🛠 Tech Stack
- **Frontend:** React, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, Zod
- **Backend:** Java 21, Spring Boot (Web, Actuator), Maven, springdoc-openapi

## ⚡ Quick Start
```bash
# 1) Start backend API
cd backend-api
mvn spring-boot:run

# 2) Start frontend (new terminal)
cd front
npm install
npm run dev
```

Open:
- Frontend: `http://localhost:5173`
- Backend API base: `http://localhost:8080/service`
- Swagger UI: `http://localhost:8080/service/swagger-ui/index.html`

## 📦 Scripts
Frontend (`front/package.json`):
- `npm run dev` — start Vite dev server
- `npm run build` — type-check and production build
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

Backend (Maven):
- `mvn spring-boot:run` — run API locally
- `mvn test` — run tests

## 📌 Notes
- The frontend uses a Vite proxy for `/service` to `http://localhost:8080` in development.
- You can also configure API access with `VITE_API_BASE_URL` and `VITE_API_PREFIX`.
- Backend includes endpoints for listing books and fetching a book by path.
- The save-progress API route exists, but backend service methods for persistence are currently not implemented.
- Story JSON files are bundled under backend resources and loaded by path.
