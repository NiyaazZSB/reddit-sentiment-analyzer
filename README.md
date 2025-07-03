# Reddit Sentiment Dashboard

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-brightgreen)](https://reddit-sentiment-analyzer.vercel.app/)

**Live Demo:** https://reddit-sentiment-analyzer.vercel.app/

This project was created by M. Niyaaz Anthony.

## Overview

Reddit Sentiment Dashboard is a web application that allows users to analyze the sentiment of Reddit posts and comments using advanced AI-powered natural language processing. The dashboard provides:
- Text analysis for individual Reddit posts or comments
- Subreddit-wide sentiment analysis
- Visualization of sentiment results and statistics
- A modern, responsive UI for easy exploration

## Tech Stack & Tools

- **Frontend:** React (UI library), TypeScript (type safety), Vite (build tool), Tailwind CSS (utility-first styling)
- **Backend:** Node.js (CommonJS, JavaScript runtime), Express (if used, server framework), Custom proxy server (handles Reddit API requests securely)
- **APIs:** Reddit API (fetches Reddit data), VADER Sentiment Analysis (via `vader-sentiment`, analyzes text sentiment)
- **Deployment:** Vercel (hosts frontend), Render (hosts backend)
- **Other Tools:**
  - ESLint (code linting and style enforcement)
  - PostCSS (CSS post-processing)
  - Git & GitHub (version control and collaboration)
  - Environment variables via `.env` (manage secrets/configuration)

## Deployment Instructions

### 1. Deploy the Backend (Render)

1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com/) and create a new Web Service.
3. Connect your GitHub repo and select the backend root directory (if needed).
4. Set the build command to `npm install` (if required).
5. Set the start command to `node reddit-proxy.cjs` (or your backend entry point).
6. Add any required environment variables (see `.env`).
7. Deploy and note your Render backend URL (e.g., `https://your-backend.onrender.com`).

### 2. Deploy the Frontend (Vercel)

1. Go to [Vercel](https://vercel.com/) and import your GitHub repo.
2. Set the project root if needed.
3. Set the install command to `npm install` (default).
4. Set the build command to `npm run build` (default for Vite/React).
5. Set the output directory to `dist`.
6. In Vercel project settings, add an environment variable to point to your backend API (e.g., `VITE_API_BASE_URL=https://your-backend.onrender.com`).
7. Deploy the frontend.

**Note:**
- The backend server must be running and accessible before the frontend can make API requests.
- Update your frontend code to use the deployed backend URL for all API calls.

## Getting Started (Local Development)

To run this project locally, you need Node.js and npm installed.

### 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd reddit-pulse-dashboard
```

### 2. Set up environment variables

- Copy the `.env` file or create one in the project root with your Reddit API credentials and any other required variables.

### 3. Install dependencies

```sh
npm install
```

### 4. Start the backend server

- In one terminal, run:

```sh
node reddit-proxy.cjs
```

### 5. Start the frontend (development server)

- In a separate terminal, run:

```sh
npm run dev
```

- The frontend will usually be available at [http://localhost:5173](http://localhost:5173) (or as indicated in your terminal).
- Make sure the backend server is running before using the frontend, so API requests work correctly.

## Features
- Analyze sentiment of Reddit posts and comments
- Subreddit sentiment overview
- Dashboard with statistics and charts
- View and clear recent analysis results

---

This project is for personal and educational use.
