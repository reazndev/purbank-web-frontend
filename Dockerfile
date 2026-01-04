# syntax=docker/dockerfile:1.4

# Multi-stage build for Angular frontend

# Stage 1: Build the Angular application (use Debian-based image for compatibility)
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Copy only dependency manifests first to leverage Docker cache
COPY package*.json ./

# Use BuildKit cache for npm to speed up repeated builds
# This requires Docker BuildKit enabled (DOCKER_BUILDKIT=1)
RUN --mount=type=cache,target=/root/.npm \
	npm ci --silent
# Copy the rest of the source
COPY . .

# Build the application for production
RUN npm run build -- --configuration production || npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist/purbank-frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
