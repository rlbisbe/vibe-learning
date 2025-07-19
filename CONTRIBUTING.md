# Contributing to Vibe Learning

Thank you for your interest in contributing to Vibe Learning! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key
- Basic knowledge of React and JavaScript

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/vibe-learning.git
   cd vibe-learning
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Add your VITE_GEMINI_API_KEY
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📖 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Tests and test coverage**
- 🔧 **Developer tooling**

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** for major changes to discuss approach
3. **Fork the repository** and create a feature branch
4. **Follow coding standards** outlined below

## 🏗️ Development Guidelines

### Code Style

- **JavaScript/React**: Follow existing patterns in the codebase
- **CSS**: Use component-specific CSS files, follow BEM methodology
- **Comments**: Write clear, concise comments for complex logic
- **Naming**: Use descriptive variable and function names

### Component Guidelines

```jsx
// ✅ Good: Clear prop types and documentation
function MyComponent({ data, onAction, isLoading }) {
  // Component logic here
  return (
    <div className="my-component">
      {/* JSX here */}
    </div>
  );
}

// ✅ Good: Export at bottom
export default MyComponent;
```

### State Management

- Use the central `useChatStateMachine` hook for global state
- Keep component-specific state local with `useState`
- Follow immutable update patterns
- Handle loading and error states appropriately

### CSS Guidelines

```css
/* ✅ Good: Component-specific, descriptive classes */
.learning-path-display {
  padding: 20px;
}

.learning-path-display__header {
  margin-bottom: 16px;
}

.learning-path-display__item {
  border: 1px solid #e5e7eb;
}

.learning-path-display__item--active {
  border-color: #2563eb;
}
```

### AI Integration

- Always handle API errors gracefully
- Show loading states for AI operations
- Use appropriate Gemini models (flash for speed, pro for accuracy)
- Validate AI responses before using them

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test these scenarios:

- [ ] **Learning Path Creation**: Enter various learning topics
- [ ] **Follow-up Questions**: Answer incomplete learning path questions
- [ ] **Q&A Generation**: Verify 15 questions are generated correctly
- [ ] **Flashcard Mode**: Test navigation, reveal, explanations
- [ ] **Session Management**: Create, load, delete sessions
- [ ] **Regeneration**: Test question regeneration
- [ ] **Responsive Design**: Test on mobile and desktop
- [ ] **Error Handling**: Test with invalid API keys, network issues

### Browser Compatibility

Test in these browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Pull Request Process

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clean, readable code
- Follow existing patterns and conventions
- Add comments for complex logic
- Update documentation if needed

### 3. Test Thoroughly

- Test your changes manually
- Ensure no existing functionality is broken
- Test edge cases and error scenarios

### 4. Commit Changes

Use conventional commit messages:

```bash
# Features
git commit -m "feat: add voice input for chat messages"

# Bug fixes
git commit -m "fix: resolve flashcard navigation on mobile"

# Documentation
git commit -m "docs: update API documentation for session management"

# Refactoring
git commit -m "refactor: simplify state machine transitions"

# Performance
git commit -m "perf: optimize Q&A rendering for large question sets"
```

### 5. Create Pull Request

- **Title**: Clear, descriptive summary
- **Description**: Explain what changes were made and why
- **Screenshots**: Include for UI changes
- **Testing**: Describe how you tested the changes

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Edge cases considered

## Screenshots (if applicable)
[Include screenshots for UI changes]

## Checklist
- [ ] Code follows project conventions
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🏷️ Issue Guidelines

### Bug Reports

Include:
- **Clear title** describing the bug
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser/OS information**
- **Console errors** if any

### Feature Requests

Include:
- **Clear title** describing the feature
- **Problem statement** - what need does this address?
- **Proposed solution** - how should it work?
- **Alternative solutions** considered
- **Additional context** or examples

## 🔧 Technical Architecture

### Key Files to Understand

- `src/useChatStateMachine.js` - Core state management
- `src/sessionStorage.js` - Data persistence
- `src/responseParser.js` - AI response handling
- `public/analyze_prompt.md` - Learning path analysis template
- `public/create_questions_and_answers.md` - Q&A generation template

### State Machine States

Understanding the state flow is crucial:

```
INITIAL → PROCESSING → WAITING_FOR_ANSWERS → PROCESSING → GENERATING_QA → READY
```

### Adding New Features

1. **State Management**: Consider if you need new states
2. **Storage**: Will the feature require data persistence?
3. **AI Integration**: Does it need new prompts or models?
4. **UI Components**: Create reusable, accessible components
5. **Error Handling**: Plan for failure scenarios

## 🎨 Design Guidelines

### UI Principles

- **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation
- **Responsive**: Mobile-first design approach
- **Consistent**: Follow existing color scheme and spacing
- **Performance**: Optimize images, minimize animations

### Color Scheme

```css
/* Primary Colors */
--primary-blue: #2563eb;
--primary-green: #10b981;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;

/* Status Colors */
--success: #059669;
--warning: #d97706;
--error: #dc2626;
```

## 📱 Mobile Considerations

- Touch-friendly button sizes (44px minimum)
- Readable text sizes (16px minimum)
- Proper viewport configuration
- Optimized layouts for small screens

## 🚫 What Not to Do

- **Don't** commit API keys or sensitive data
- **Don't** break existing functionality without discussion
- **Don't** add large dependencies without justification
- **Don't** ignore accessibility requirements
- **Don't** skip testing on mobile devices
- **Don't** use inline styles (use CSS classes)

## 💬 Getting Help

- **Issues**: Create an issue for bugs or questions
- **Discussions**: Use GitHub Discussions for general questions
- **Documentation**: Check DOCUMENTATION.md for technical details

## 🎯 Areas Needing Contribution

We'd especially welcome contributions in these areas:

- **Testing**: Unit tests, integration tests, E2E tests
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Code splitting, lazy loading, optimization
- **Mobile UX**: Touch interactions, responsive improvements
- **AI Prompts**: Better prompt engineering for more accurate responses
- **Export/Import**: Session data export/import functionality
- **Analytics**: Learning progress tracking and insights

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow GitHub's community guidelines

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- README acknowledgments for major features

Thank you for contributing to Vibe Learning! 🚀