# ── Stage 1: builder ──────────────────────────────────────────────────────────
# Build the React app into static files
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching — npm install only reruns when these change)
COPY package.json package-lock.json ./

RUN npm ci --silent

# Copy source and build
COPY . .

# Vite build outputs to /app/dist
RUN npm run build


# ── Stage 2: serve with nginx ─────────────────────────────────────────────────
# Nginx serves the built static files — tiny final image, no Node.js needed
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Our custom nginx config for serving the React SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]