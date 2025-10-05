.PHONY: help install dev build docker-up docker-down docker-logs clean

help:
	@echo "Siloam Hospital System - Available Commands"
	@echo ""
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Run development servers"
	@echo "  make build        - Build all projects"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make docker-logs  - View Docker logs"
	@echo "  make clean        - Clean build artifacts"
	@echo ""

install:
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Done!"

dev:
	@echo "Starting development servers..."
	npm run dev

build:
	@echo "Building projects..."
	npm run build

docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d
	@echo "Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:4000"

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down

docker-logs:
	docker-compose logs -f

clean:
	@echo "Cleaning build artifacts..."
	rm -rf backend/dist backend/node_modules
	rm -rf frontend/.next frontend/node_modules
	@echo "Clean complete!"
