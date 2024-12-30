# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# HomeWise AI

A local AI assistant that respects your privacy.

## Project Structure

### Configuration Files

- `vite.config.ts`: Build and development configuration
- `vitest.config.ts`: Test configuration and coverage settings

These configurations are intentionally separated to:

- Maintain clear separation of concerns
- Avoid type conflicts between Vite and Vitest
- Allow independent versioning and updates
- Provide better type safety and maintainability

## Development

### Prerequisites

- Node.js 18+
- Rust (latest stable)
- Cargo

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Run tests: `npm test`

### Testing

Tests are run using Vitest with the following requirements:

- Minimum 80% coverage for all metrics
- Tests must pass before pushing (enforced by pre-push hooks)
- Coverage reports are generated in HTML and JSON formats

### Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report

## Contributing

Please see CONTRIBUTING.md for guidelines.

## License

[License details here]
