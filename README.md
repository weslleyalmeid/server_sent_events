# Server-Sent Events (SSE) with Next.js and FastAPI

## Overview
This project demonstrates Server-Sent Events (SSE) by integrating a Next.js frontend with a FastAPI backend.

## Pre-requirements
- Node.js (v14+)
- Python (v3.8+)
- Dependencies:
  - FastAPI
  - sse_starlette
  - Next.js
- uv package (a shortcut for uvicorn)

## Getting Started

### Backend
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install Python dependencies:
   ```
   uv init
   ```
3. Run the FastAPI server using uv:
   ```
   uv run main:app --reload
   ```

### Frontend
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install Node dependencies:
   ```
   npm install
   ```
3. Run the Next.js development server:
   ```
   npm run dev
   ```

## Project Structure
- **backend/**: Contains the FastAPI server and SSE endpoints.
- **frontend/**: Contains the Next.js application consuming the SSE stream.

## References
- [Server-Sent Events (SSE) | NextJS & FastApi - Describly](https://www.youtube.com/watch?v=Yfj3jfKL_AQ&t=2151s)
- [Server-Sent Events (SSE): Comunicação em tempo real - Full Cycle](https://www.youtube.com/watch?v=5TN9cyGev1M)

Enjoy the project!


