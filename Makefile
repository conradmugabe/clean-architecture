# Clean Architecture TypeScript Project Makefile

# Variables
NPM_CMD = pnpm
NODE_ENV ?= development

# Default target
.DEFAULT_GOAL := help

# Help target
.PHONY: help
help: ## Show this help message
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Installation
.PHONY: install
install: ## Install dependencies
	$(NPM_CMD) install

# Development
.PHONY: dev
dev: ## Start development server
	$(NPM_CMD) run dev

.PHONY: start
start: ## Start production server
	$(NPM_CMD) run start

# Testing
.PHONY: test
test: ## Run unit tests
	$(NPM_CMD) run test

.PHONY: test-watch
test-watch: ## Run unit tests in watch mode
	$(NPM_CMD) run test:watch

.PHONY: test-ui
test-ui: ## Run tests with UI
	$(NPM_CMD) run test:ui

.PHONY: test-integration
test-integration: ## Run integration tests
	$(NPM_CMD) run test:integration

.PHONY: test-all
test-all: ## Run all tests
	$(NPM_CMD) run test:all

.PHONY: test-coverage
test-coverage: ## Run tests with coverage
	$(NPM_CMD) run test:coverage

.PHONY: test-all-coverage
test-all-coverage: ## Run all tests with coverage
	$(NPM_CMD) run test:all:coverage

# Docker
.PHONY: docker-build
docker-build: ## Build Docker image
	docker build -t clean-architecture .

.PHONY: docker-build-dev
docker-build-dev: ## Build development Docker image
	docker build -f Dockerfile.dev -t clean-architecture:dev .

.PHONY: docker-up
docker-up: ## Start Docker containers
	docker compose up -d

.PHONY: docker-up-dev
docker-up-dev: ## Start development Docker containers
	docker compose -f compose.dev.yaml up -d

.PHONY: docker-up-test
docker-up-test: ## Start test Docker containers
	docker compose -f compose.test.dev.yaml up -d

.PHONY: docker-down
docker-down: ## Stop Docker containers
	docker compose down

.PHONY: docker-logs
docker-logs: ## Show Docker container logs
	docker compose logs -f

# Database
.PHONY: db-migrate
db-migrate: ## Run database migrations
	$(NPM_CMD) exec drizzle-kit migrate

.PHONY: db-generate
db-generate: ## Generate database migrations
	$(NPM_CMD) exec drizzle-kit generate

.PHONY: db-studio
db-studio: ## Open database studio
	$(NPM_CMD) exec drizzle-kit studio

# Cleanup
.PHONY: clean
clean: ## Clean dependencies and build files
	rm -rf node_modules
	rm -rf dist
	rm -rf coverage

.PHONY: clean-docker
clean-docker: ## Clean Docker containers and images
	docker compose down --rmi all --volumes --remove-orphans

# CI/CD helpers
.PHONY: ci-test
ci-test: install test-all-coverage ## Run full test suite for CI

.PHONY: ci-build
ci-build: install docker-build ## Build for CI

# Quick development workflow
.PHONY: setup
setup: install ## Setup project for development
	@echo "Project setup complete! Run 'make dev' to start development."

.PHONY: check
check: test-all ## Run all checks (tests)
	@echo "All checks passed!"