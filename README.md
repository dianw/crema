# Crema - Graphical Crypto Toolkit

> A modern web-based cryptographic toolkit built with Nuxt 4, Vue 3, and TypeScript

[![CI/CD](https://github.com/dianw/crema/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/dianw/crema/actions/workflows/ci-cd.yml)

**Live Demo**: https://crema.enkrip.org

![crema](https://user-images.githubusercontent.com/363775/32182106-81f8c62c-bdc8-11e7-8a65-3c4630c8b699.png)

## Features

- **Hash Functions**: MD5, SHA-1, SHA-256, SHA-384, SHA-512
- **Public Key Infrastructure**: RSA key generation, Certificate Signing Requests
- **Modern UI**: Built with Tailwind CSS and responsive design
- **Firebase Authentication**: Secure user authentication
- **Progressive Web App**: Optimized for all devices

## Tech Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS + SCSS
- **State Management**: Pinia stores
- **Authentication**: Firebase Auth
- **Crypto**: Node-Forge library
- **Build Tool**: Vite
- **Deployment**: Static hosting (GitHub Pages compatible)

## Development Setup

```bash
# Clone the repository
git clone https://github.com/dianw/crema.git
cd crema

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview

# Run type checking
npm run typecheck

# Lint code
npm run lint

# Clean build cache
npm run clean
```

## Project Structure

```
crema/
├── assets/          # Static assets (CSS, images)
├── components/      # Vue components (auto-imported)
├── composables/     # Reusable composition functions
├── layouts/         # Application layouts
├── middleware/      # Route middleware
├── pages/           # File-based routing
├── plugins/         # Nuxt plugins
├── public/          # Static files served directly
├── stores/          # Pinia state management
├── types/           # TypeScript type definitions
└── utils/           # Utility functions and constants
```

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages. The build process generates a static site that can be hosted on any static hosting platform.

### Automatic Deployment

1. Push your changes to the `main` or `master` branch
2. The GitHub Actions workflow automatically:
   - Builds the project
   - Generates static files
   - Deploys to GitHub Pages

### Manual Deployment

```bash
# Generate static files
npm run generate

# The generated files will be in .output/public/
# Upload these files to your static hosting provider
```

### Configuration for GitHub Pages

The project includes:
- `.nojekyll` file for proper asset serving
- GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Static site generation with `nuxt generate`
- Base URL configuration for subdirectory hosting

## Key Improvements in v2.0

- Upgraded to Nuxt 4 with latest features
- Full TypeScript support with strict typing
- Improved project structure and organization
- Enhanced error handling and middleware
- Better component auto-importing
- Optimized build and development experience
- Modern composables and utilities
- Improved type safety across the application
- **Static site generation for GitHub Pages compatibility**
- **Removed server-side dependencies for universal hosting**

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
