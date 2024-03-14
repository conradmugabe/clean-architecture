# Clean Architecture

[![codecov](https://codecov.io/gh/conradmugabe/clean-architecture/graph/badge.svg?token=MV34vwzdm8)](https://codecov.io/gh/conradmugabe/clean-architecture)

This repository demonstrates how to archive clean architecture in a Node.js Typescript codebase. There's a huge reliance on dependency injection for loosely-coupled software design.

## Technologies used
1. Typescript
1. Vitest
1. Docker

## How to run tests
```bash

# Running all tests
pnpm test:all
pnpm test:all:coverage # with test coverage

# Running only unit tests
pnpm test
pnpm test:coverage # with test coverage
pnpm test:watch # with watch mode
pnpm test:ui # with browser ui

# Running only integration tests
pnpm test:integration

```

