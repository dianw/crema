# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-07-20

### Added
- Upgraded to Nuxt 4 with latest features and performance improvements
- Full TypeScript support with strict typing across the entire application
- Improved project structure with better organization
- New composables directory with reusable composition functions (`useCrypto`)
- Enhanced type definitions in dedicated `types/` directory
- Authentication middleware for route protection
- Server-side API endpoints (health check)
- Modern error handling with custom error page
- Better state management with typed Pinia stores
- Auto-import improvements for components and composables
- Enhanced constants and utility functions

### Changed
- Upgraded from Nuxt 3 to Nuxt 4
- Refactored all stores to use proper TypeScript types
- Moved `static/` folder to `public/` (Nuxt 4 standard)
- Improved Firebase authentication with better type safety
- Updated package.json scripts with new Nuxt 4 commands
- Restructured project layout following Nuxt 4 best practices
- Completely rewritten README with comprehensive documentation

### Improved
- Better development experience with improved hot reload
- Enhanced code organization and maintainability
- Better TypeScript intellisense and error detection
- Optimized build performance
- Improved developer tooling and scripts

### Technical Details
- Updated `nuxt.config.ts` with Nuxt 4 configuration
- Added future compatibility flags for Nuxt 4 features
- Enhanced error handling with proper TypeScript support
- Improved component auto-importing (removed manual index.ts)
- Better structured stores with computed properties
- Added middleware for authentication flow
- Created server-side API structure for future expansion

### Migration Notes
- All existing functionality remains compatible
- No breaking changes for end users
- Developers should run `npm install` to get new dependencies
- TypeScript errors may appear due to improved type checking

## [1.0.0] - Previous Release

### Features
- Hash functions (MD5, SHA-1, SHA-256, SHA-384, SHA-512)
- RSA key generation
- Certificate Signing Request generation
- Firebase authentication
- Responsive design with Tailwind CSS
- Docker containerization
- GitHub Pages deployment
