# Bilkent Scheduler

[Bilkent Scheduler](https://www.bilkentscheduler.com/) is an open-source tool designed to assist students at Bilkent University in planning their course schedules.

Students can pick a semester and courses, optionally lock preferred instructors or exclude time slots, and the app generates all valid weekly schedule alternatives.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Data Update Flow](#data-update-flow)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- Generate all non-conflicting schedule combinations for selected courses
- Select preferred instructors per course section
- Exclude undesired time slots to filter results
- Export the current schedule as an image
- Built-in first-time user guide

## Project Structure

The project has two main parts:

- **Visualizer (React app):** reads static JSON data from `public/data`, computes valid combinations, and renders schedules in the browser.
- **Scraper (Node.js script):** fetches departments, semesters, and offerings from Bilkent sources and writes updated JSON files.

## Getting Started

### Prerequisites

- Node.js 16+ (Node.js 18 is also used in CI for scraping)
- Yarn

### Quick start

```bash
yarn install
yarn start
```

Then open [http://localhost:3000](http://localhost:3000).

### Available Yarn scripts

#### Development

```bash
# Start local React development server (http://localhost:3000)
yarn start
```

#### Quality checks

```bash
# Run ESLint checks
yarn lint

# Run ESLint and auto-fix issues when possible
yarn lint:fix

# Format codebase with Prettier
yarn format
```

#### Build and release

```bash
# Create optimized production build in build/
yarn build
```

#### Data updates

```bash
# Run scraper and refresh public/data JSON files
yarn fetch-offerings
```

## Data Update Flow

Course data is refreshed by the `Fetch Offerings` GitHub Actions workflow:

1. Runs daily on a cron schedule (`0 2 * * *` UTC) and can also be triggered manually.
2. Executes `yarn fetch-offerings`.
3. Updates JSON files under `public/data`.
4. Commits and pushes data changes back to `main`.

You can also run the scraper manually:

```bash
yarn fetch-offerings
```

## Deployment

- Hosting is handled by **Firebase Hosting**.
- On every push to `main` (excluding `scraper/**`-only changes), GitHub Actions builds and deploys the app.
- Deployment requires repository secrets such as `FIREBASE_TOKEN` and `REACT_APP_GA_TRACKING_ID`.

## Contributing

Bilkent Scheduler is a community project, and contributions play a key role in keeping it useful and up to date for students. Whether you want to report a bug, improve documentation, clean up existing code, or implement a new feature, your help is appreciated.

If you decide to contribute, please keep changes focused, explain the reasoning behind your update, and include enough context for others to review and build on your work.

### Code changes

For code contributions, aim for small and reviewable pull requests that solve one problem at a time. This helps maintainers review faster and reduces the risk of regressions.

Before opening a PR:

- Create a dedicated feature/fix branch.
- Run formatting, linting, and build checks before opening a PR.
- Explain what changed and why in the PR description.
- Add screenshots/GIFs for UI changes when applicable.
- Mention follow-up work or known limitations.

### Issues

When creating an issue:

- Use a clear title and describe expected vs actual behavior.
- Include reproduction steps, environment details, and screenshots when possible.
- For feature requests, explain the use case and why it is needed.

## License

[MIT](LICENSE)
