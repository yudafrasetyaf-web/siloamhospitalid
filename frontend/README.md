# Siloam Hospital Frontend

Modern, responsive frontend for the Siloam Hospital Management System.

## Tech Stack

- Next.js 14 + TypeScript
- React 18
- Tailwind CSS
- Zustand (State Management)
- Axios (API Client)
- next-i18next (Internationalization)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## Features

- Multi-language support (ID/EN)
- Responsive design
- Doctor search and filtering
- Online appointment booking
- User authentication
- Profile management

## Project Structure

```
src/
├── components/     - React components
├── pages/          - Next.js pages
├── lib/            - Utilities
├── store/          - State management
└── styles/         - Global styles
```

## Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript check
