# Multi-stage build for Crema static site
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate static site
RUN npm run generate

# Production stage - serve static files with nginx
FROM nginx:alpine

# Copy static files from builder stage
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Create nginx configuration for SPA
RUN echo 'server {\
    listen 80;\
    server_name localhost;\
    root /usr/share/nginx/html;\
    index index.html;\
\
    # Handle client-side routing\
    location / {\
        try_files $uri $uri/ /index.html;\
    }\
\
    # Cache static assets\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\
        expires 1y;\
        add_header Cache-Control "public, immutable";\
    }\
\
    # Security headers\
    add_header X-Frame-Options "SAMEORIGIN" always;\
    add_header X-Content-Type-Options "nosniff" always;\
    add_header X-XSS-Protection "1; mode=block" always;\
\
    # Gzip compression\
    gzip on;\
    gzip_vary on;\
    gzip_min_length 1024;\
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;\
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
