# Contributing to MoodPop 🌍

Thank you for your interest in contributing to MoodPop! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful, inclusive, and considerate when contributing. We want MoodPop to be a welcoming project for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-repo/moodpop/issues)
2. If not, create a new issue using the bug report template
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/device information

### Suggesting Features

1. Check existing issues and discussions
2. Create a new issue using the feature request template
3. Explain:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative approaches considered

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/moodpop.git
   cd moodpop
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run dev
   # Test manually in browser
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation changes
   - `style:` formatting, missing semicolons, etc.
   - `refactor:` code refactoring
   - `test:` adding tests
   - `chore:` maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Link related issues

## Development Guidelines

### Code Style

**TypeScript:**
- Use TypeScript strict mode
- Define proper types and interfaces
- Avoid `any` type
- Use meaningful variable names

**React:**
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

**CSS:**
- Follow existing naming conventions
- Use CSS variables for colors
- Mobile-first approach
- Prefer flexbox/grid over floats

**Example:**
```typescript
// Good
interface MoodData {
  country: string;
  mood: MoodType;
  timestamp: number;
}

const MoodButton = ({ mood, onClick }: MoodButtonProps) => {
  // Component logic
};

// Avoid
const MoodButton = (props: any) => {
  // Component logic
};
```

### Project Structure

```
moodpop/
├── client/               # Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API/Socket services
│   │   ├── types.ts      # TypeScript types
│   │   └── store.ts      # State management
│   └── public/           # Static assets
└── server/               # Backend
    └── src/
        ├── models/       # Database models
        ├── services/     # Business logic
        └── index.ts      # Server entry
```

### Testing

While we don't have automated tests yet, please manually test:

1. **Frontend:**
   - All mood buttons work
   - Globe renders correctly
   - Socket connection established
   - Real-time updates working
   - Responsive on mobile
   - Cross-browser compatibility

2. **Backend:**
   - API endpoints respond correctly
   - Database operations succeed
   - Socket events handled properly
   - Error handling works

### Performance

- Keep bundle size small
- Optimize images
- Use lazy loading where appropriate
- Minimize re-renders
- Profile before optimizing

### Accessibility

- Use semantic HTML
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain color contrast ratios

## Areas Needing Contribution

### High Priority
- [ ] Add automated tests (Jest, React Testing Library)
- [ ] Implement mood history visualization
- [ ] Add country/city drill-down view
- [ ] Improve mobile UX
- [ ] Add loading states

### Medium Priority
- [ ] Add dark/light theme toggle
- [ ] Implement push notifications
- [ ] Add share functionality
- [ ] Create mood analytics dashboard
- [ ] Improve error handling

### Low Priority
- [ ] Add sound effects
- [ ] Create mobile app (React Native)
- [ ] Add custom mood themes
- [ ] Implement user profiles (optional)
- [ ] Add internationalization (i18n)

## Documentation

When adding features, update:
- README.md (if architecture changes)
- DEVELOPMENT.md (if dev process changes)
- Code comments (for complex logic)
- Type definitions (for new data structures)

## Questions?

- Open a discussion on GitHub
- Comment on related issues
- Check existing documentation

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Thanked in commit messages

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make MoodPop better! 🌍💙**
