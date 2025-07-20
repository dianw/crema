# Serve pre-built static site with nginx
FROM nginx:alpine

# Copy pre-built static files to nginx html directory
COPY .output/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
