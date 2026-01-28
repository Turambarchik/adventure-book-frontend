# Adventure Book — React Take-Home Assignment

This project is a small interactive “choose-your-own-adventure” game built as a **take-home assignment** using **React, TypeScript, and Vite**.

The application loads a book, validates its structure, allows the user to navigate through sections via choices, tracks progress and health points, and supports saving gameplay progress.

---

## Tech Stack

- React 18  
- TypeScript  
- Vite  
- React Router  
- TanStack Query (data fetching & mutations)  
- Tailwind CSS  

---

## Features

- 📖 Load and validate an adventure book  
- 🧭 Navigate between sections via choices  
- ❤️ Health (HP) system with consequences  
- 🕔 Progress tracking (visited vs reachable sections)  
- 💾 Save current progress via API  
- 🔁 Restart and replay completed or failed runs  
- ♿ Accessible focus management for section changes  
- 🧼 Defensive parsing of API data (IDs, numbers, consequences)  

---

## Requirements Coverage

The assignment was **completed fully wihout extras**.

Each domain is handled end-to-end:
- validated on load,
- safely rendered in the UI,
- and integrated into gameplay logic (navigation, progress, HP, and saving).

No required parts of the specification were skipped or stubbed.

---

## Architecture Notes

### Validation

- The book is validated upfront using `validateBookForGameplay`.
- Invalid structures are detected early and reported to the user instead of failing at runtime.

---

## How to Run the Project

### Prerequisites

- Node.js >= 20.19
- npm (or yarn / pnpm)

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```