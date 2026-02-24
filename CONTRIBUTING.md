# Contributing to Smart Digital Locker System

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to the Smart Digital Locker System. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps to reproduce the problem** in as much detail as possible.
- **Provide specific examples** to demonstrate the steps.
- **Describe the behavior you observed** after following the steps and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see** instead and why.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as much detail as possible.
- **Explain why this enhancement would be useful** to most users.

### Pull Requests

The process described here has several goals:

- Maintain the quality of the code.
- Fix problems that are important to users.
- Engage the community in working toward the best possible solution.

Please follow these steps to have your contribution considered by the maintainers:

1.  **Fork the repository** and create your branch from `main`.
2.  **Clone the repository** locally.
3.  **Set up the development environment** (see README.md for details).
4.  **Make your changes**. Ensure you write clean, maintainable code.
5.  **Run tests**. Ensure that your changes do not break existing functionality.
    *   Backend: `pytest`
    *   Frontend: `npm test` (if applicable)
6.  **Commit your changes** using descriptive commit messages.
7.  **Push to your fork** and submit a Pull Request.
8.  **Wait for review**. The maintainers will review your PR and may request changes.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally after the first line.

### Python Styleguide (Backend)

- Follow PEP 8.
- Use type hints where possible.
- Use `black` or `autopep8` for formatting if available.
- Ensure all new endpoints have corresponding Pydantic schemas.

### React/TypeScript Styleguide (Frontend)

- Follow standard React best practices.
- Use functional components and Hooks.
- Ensure strict type checking with TypeScript.
- Use `ESLint` and `Prettier` for formatting.
- Keep components small and reusable.

## Development Setup

Please refer to the README.md file for detailed instructions on setting up the backend (FastAPI) and frontend (React) environments.

### Quick Reference

- **Backend**: `uvicorn app.main:app --reload`
- **Frontend**: `npm run dev`

---

Thank you for contributing!