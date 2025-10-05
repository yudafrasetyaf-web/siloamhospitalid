# Contributing to Siloam Hospital System

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Follow best practices
- Write clean, maintainable code
- Document your changes

## How to Contribute

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/siloam-hospital-system.git
cd siloam-hospital-system
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes

- Follow the existing code style
- Add tests if applicable
- Update documentation

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Commit Message Guidelines

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## Development Guidelines

### Backend

- Use TypeScript strict mode
- Follow MVC architecture
- Add proper error handling
- Write unit tests for controllers
- Document API endpoints

### Frontend

- Use TypeScript
- Follow React best practices
- Use functional components and hooks
- Ensure responsive design
- Add loading and error states

## Testing

Run tests before submitting PR:

```bash
# Backend
cd backend
npm test
npm run lint

# Frontend
cd frontend
npm run lint
npm run type-check
```

## Questions?

Create an issue or reach out to the maintainers.
