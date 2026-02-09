# Variables
FRONTEND_DIR = frontend
BACKEND_DIR = backend/glasgowuniversityrowingwebsite/glasgowuniversityrowingwebsite

# Detect OS for Maven wrapper command
MVN_CMD = ./mvnw
ifeq ($(OS),Windows_NT)
    MVN_CMD = mvnw.cmd
endif

.PHONY: help install dev start-frontend start-backend

help:
	@echo "Available commands:"
	@echo "  make install         - Install dependencies for both frontend and backend"
	@echo "  make dev             - Run both frontend and backend locally (parallel)"
	@echo "  make start-frontend  - Run only the frontend"
	@echo "  make start-backend   - Run only the backend"

install:
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && $(MVN_CMD) clean install -DskipTests

dev:
	$(MAKE) -j2 start-frontend start-backend

start-frontend:
	cd $(FRONTEND_DIR) && npm run dev

start-backend:
	cd $(BACKEND_DIR) && $(MVN_CMD) spring-boot:run