# Contributing to EcoWise AI

Thank you for your interest in contributing to **EcoWise AI**! We welcome contributions from developers, designers, writers, and environment enthusiasts of all levels.

---

## Code of Conduct

Please maintain a respectful, inclusive, and collaborative environment. Be supportive of other contributors and keep conversations focused on constructive feedback.

---

## How Can I Contribute?

### 1. Reporting Bugs
* Search existing issues to verify the bug hasn't already been reported.
* Create a new issue describing the problem, step-by-step reproduction steps, expected behavior, and screenshots if applicable.

### 2. Suggesting Enhancements
* Open an issue with the tag `enhancement`.
* Explain the user value, how it fits into the core mission of EcoWise AI, and any design/mockup suggestions.

### 3. Submitting Pull Requests
* Fork the repository and create a new branch from `main`:
  ```bash
  git checkout -b feature/my-amazing-feature
  ```
* Write clean, self-documenting code.
* Ensure all TypeScript code compiles without warnings:
  ```bash
  npm run build
  ```
* Commit your changes with descriptive messages:
  ```bash
  git commit -m "feat: implement real-time carbon offset logging"
  ```
* Push your branch and open a Pull Request targeting the `main` branch.

---

## Technical Standards

* **Language**: TypeScript (strict type checking is enforced).
* **Styling**: Tailwind CSS v4. Ensure all utility overrides are configured in `src/index.css`.
* **State Management**: React Context (`AppContext.tsx`). Avoid introducing heavy external state managers unless absolutely necessary.
* **Component Design**: Keep UI components responsive, functional, and keyboard accessible.

---

## Questions?

Feel free to open a discussion or contact the maintainers at the GitHub repository: **[https://github.com/YuvrajGora/EcoWise-AI.git](https://github.com/YuvrajGora/EcoWise-AI.git)**.
