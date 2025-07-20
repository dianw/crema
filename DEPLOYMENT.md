# GitHub Pages Deployment Guide

This guide explains how to deploy the Crema app to GitHub Pages.

## Prerequisites

1. A GitHub repository for your project
2. GitHub Pages enabled in repository settings

## Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the main branch.

### Setup Steps:

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set Source to "GitHub Actions"

2. **Configure Repository**:
   - Ensure your default branch is `main` or `master`
   - The workflow file is already included at `.github/workflows/deploy.yml`

3. **Deploy**:
   - Push changes to the main branch
   - GitHub Actions will automatically build and deploy your site
   - Your site will be available at `https://username.github.io/repository-name`

## Manual Deployment

If you prefer to deploy manually:

1. **Generate static files**:
   ```bash
   npm run generate
   ```

2. **Upload files**:
   - The generated files are in `.output/public/`
   - Upload these files to your GitHub Pages repository
   - Or use the `gh-pages` branch method

## Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings

## Base URL Configuration

If deploying to a subdirectory (e.g., `username.github.io/project-name`):

1. Set the `NUXT_APP_BASE_URL` environment variable:
   ```bash
   export NUXT_APP_BASE_URL=/project-name/
   ```

2. Or update `nuxt.config.ts`:
   ```typescript
   app: {
     baseURL: '/project-name/'
   }
   ```

## Troubleshooting

- **404 errors**: Ensure `.nojekyll` file is present in the `public/` directory
- **Assets not loading**: Check that baseURL is correctly configured
- **Build fails**: Check the Actions tab in your repository for error details
