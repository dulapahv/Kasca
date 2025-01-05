# Kasca - Code Collaboration Platform

<div align="center">
  <a href="https://kasca.dulapahv.dev/">
    <img src="apps/client/public/images/cover.png?raw=true" width="600" alt="kasca cover image"/>
  </a>
</div>

<br />

<div align="center">
  <a href="https://github.com/dulapahv/Kasca/actions/workflows/playwright.yml"><img src="https://github.com/dulapahv/Kasca/actions/workflows/playwright.yml/badge.svg"></a>
  <a href="https://github.com/dulapahv/Kasca/issues"><img src="https://img.shields.io/github/issues/dulapahv/Kasca.svg?style=flat" /></a>
  <a href="https://codeclimate.com/github/dulapahv/Kasca/maintainability"><img src="https://api.codeclimate.com/v1/badges/3984a19491b5e90cfa08/maintainability" /></a>
</div>

<br />

**Kasca is an online code collaboration platform that enables real-time coding, cursor sharing, live UI preview, and video communication with integrated Git support—no sign-up required.**

**✨ Try now at [kasca.dulapahv.dev](https://kasca.dulapahv.dev/)**

> This project is part of the course "COMPSCI4025P Level 4 Individual Project" at the University of Glasgow.

For detailed usage instructions and feature documentation, please see the **[User Manual](manual.md)**.

## Features

- **Real-time Collaboration** - Code together in real-time with cursor sharing, highlighting, and follow mode
- **Shared Terminal** - Execute code and see results together with over 80 supported languages
- **Live UI Preview** - Preview UI changes instantly with loaded libraries like Tailwind CSS, and more
- **GitHub Integrated** - Save your work and open files from your repositories
- **Shared Notes** - Take notes together in real-time with rich text and markdown support
- **Video & Voice** - Communicate with your team using video and voice chat

## Table of Contents

- [Kasca - Code Collaboration Platform](#kasca---code-collaboration-platform)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Development](#development)
  - [Scripts](#scripts)
  - [Testing](#testing)
    - [Frontend Testing](#frontend-testing)
    - [Backend Testing](#backend-testing)
  - [Deployment](#deployment)
  - [Tech Stack](#tech-stack)
  - [Coding Style](#coding-style)
  - [Contributing](#contributing)
  - [User Manual](#user-manual)
  - [License](#license)

## Project Structure

The project is organized as a monorepo using [Turborepo](https://turbo.build/repo/docs):

```txt
kasca
├── apps/              # Application packages
│   ├── client/        # Frontend Next.js application
│   └── server/        # Backend Socket.IO server
├── packages/          # Shared packages
│   └── types/         # Shared TypeScript types and enums
├── package.json       # Root package.json
└── pnpm-workspace.yaml
```

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- A package manager ([pnpm](https://pnpm.io/) recommended)

> While this project uses pnpm for development, you can use [npm](https://www.npmjs.com/) instead. Simply replace `pnpm` with `npm` in all commands. However, we recommend using pnpm for its better performance and disk space efficiency.

## Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/dulapahv/kasca.git
   cd kasca
   ```

2. Install dependencies (this will install all workspace dependencies)

   ```bash
   pnpm i
   ```

## Development

To run the development environment:

Start all applications in development mode:

```bash
pnpm dev
```

Or start individual applications:

```bash
# Start only the client
pnpm --filter kasca-client dev

# Start only the server
pnpm --filter kasca-server dev
```

The application will be available at:

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:3001>

## Scripts

Root level scripts available:

```bash
# Development
pnpm dev              # Start all applications in development mode
pnpm build            # Build all packages
pnpm clean            # Clean all builds and node_modules

# Testing
pnpm test:client          # Run frontend E2E tests (Playwright)
pnpm test:client:ui       # Run frontend tests with UI mode
pnpm test:client:debug    # Debug frontend tests
pnpm test:client:report   # View frontend test report
pnpm test:server          # Run backend tests against local server
pnpm test:server:remote   # Run backend tests against remote server
pnpm test:server:watch    # Run backend tests in watch mode

# Linting and Formatting
pnpm lint:check       # Run ESLint checks (frontend only)
pnpm lint:fix         # Fix ESLint issues (frontend only)
pnpm format:check     # Check formatting
pnpm format:fix       # Fix formatting issues
```

You can also run scripts for specific workspaces:

```bash
# Frontend specific
pnpm --filter kasca-client dev
pnpm --filter kasca-client build
pnpm --filter kasca-client test:client

# Backend specific
pnpm --filter kasca-server dev
pnpm --filter kasca-server build
pnpm --filter kasca-server test:server
```

## Testing

All test commands can be run from both the root directory and their respective workspaces. Ensure the server is running before executing test commands.

### Frontend Testing

End-to-end tests using Playwright:

```bash
# In root directory or client workspace
pnpm test:client         # Run all frontend E2E tests
pnpm test:client:ui      # Run frontend tests with UI mode
pnpm test:client:debug   # Debug frontend tests
pnpm test:client:report  # View frontend test report

# Run in client workspace only
pnpm --filter kasca-client test:client
```

### Backend Testing

Server-side tests using Jest:

```bash
# In root directory or server workspace
pnpm test:server           # Run backend tests against local server
pnpm test:server:remote    # Run backend tests against remote server
pnpm test:server:watch     # Run backend tests in watch mode (local server)

# Run in server workspace only
pnpm --filter kasca-server test:server
```

## Deployment

The project is configured for automatic deployment:

- Frontend (client): Automatically deploys to [Vercel](https://vercel.com)
- Backend (server): Automatically deploys to [Render](https://render.com)

Simply push to the main branch, and both platforms will automatically build and deploy the changes.

For manual builds:

```bash
# Build frontend
pnpm --filter kasca-client build

# Build backend
pnpm --filter kasca-server build
```

## Tech Stack

- **Frontend:**
  - [Next.js](https://nextjs.org)
  - [TypeScript](https://www.typescriptlang.org)
  - [Tailwind CSS](https://tailwindcss.com)
  - [shadcn/ui](https://ui.shadcn.com/)
  - [Monaco Editor](https://microsoft.github.io/monaco-editor/) (code editor)
  - [Socket.IO Client](https://socket.io)
  - [Sandpack](https://sandpack.codesandbox.io/) (live preview)
  - [MDXEditor](https://mdxeditor.dev/) (notepad)
  - [simple-peer](https://github.com/feross/simple-peer) (WebRTC)
  - [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev/)
- **Backend:**
  - [Node.js](https://nodejs.org)
  - [TypeScript](https://www.typescriptlang.org)
  - [Socket.IO](https://socket.io) (binded to [µWebSockets.js](https://github.com/uNetworking/uWebSockets.js) server)
- **Testing:**
  - [Playwright](https://playwright.dev) (end-to-end testing for frontend)
  - [Jest](https://jestjs.io) (unit testing for backend)
- **External Services:**
  - [Piston](https://github.com/engineer-man/piston) (code execution)
  - [GitHub REST API](https://docs.github.com/en/rest) (repository management)

## Coding Style

We use several tools to maintain code quality:

- [ESLint](https://eslint.org/) for static code analysis (frontend only)
- [Prettier](https://prettier.io/) for code formatting
- [prettier-plugin-sort-imports](https://github.com/trivago/prettier-plugin-sort-imports) for import statement organization
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) for Tailwind CSS class sorting (frontend only)
- [prettier-plugin-classnames](https://github.com/ony3000/prettier-plugin-classnames) for wrapping long Tailwind CSS class names (frontend only)

Check and fix code style:

```bash
pnpm lint:check    # Check ESLint issues
pnpm lint:fix      # Fix ESLint issues
pnpm format:check  # Check formatting issues
pnpm format:fix    # Fix formatting issues
```

## Contributing

1. Create a new branch for your feature
2. Commit changes following [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)
3. Submit a Pull Request with a description of your changes

## User Manual

For detailed information about using Kasca, including:

- Feature guides
- Keyboard shortcuts
- Troubleshooting

Please refer to the **[User Manual](manual.md)**.

## License

MIT License - see the [LICENSE](LICENSE) file for details
