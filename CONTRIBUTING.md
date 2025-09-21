# Contributing to VibeBlogger

Thank you for your interest in contributing to VibeBlogger! We welcome contributions from the community and are grateful for your help in making this project better.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/vibe-blogger.git
   cd vibe-blogger
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   # Fill in your environment variables
   ```
5. **Set up the database**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test them thoroughly

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Run tests and linting**:
   ```bash
   npm run check
   npm run lint
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub

## Code Style

- Use **TypeScript** for all new code
- Follow the existing code style and patterns
- Use **Prettier** for code formatting (run `npm run format:write`)
- Use **ESLint** for code linting (run `npm run lint:fix`)

## Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Pull Request Guidelines

1. **Keep PRs focused** - One feature or fix per PR
2. **Write clear descriptions** - Explain what your PR does and why
3. **Add tests** - Include tests for new features when possible
4. **Update documentation** - Update README or other docs if needed
5. **Ensure CI passes** - All checks must pass before merging

## Reporting Issues

When reporting issues, please include:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (OS, browser, Node.js version)
- **Screenshots** if applicable

## Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** first to avoid duplicates
2. **Provide clear use cases** and benefits
3. **Consider implementation complexity**
4. **Be open to discussion** and feedback

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to create a welcoming environment for all contributors.

## Questions?

Feel free to:
- Open an issue for questions
- Join our community discussions
- Reach out to the maintainers

Thank you for contributing to VibeBlogger! 🚀
