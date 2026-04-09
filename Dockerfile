FROM node:18-alpine AS builder

WORKDIR /app

# Copy entire client folder (including src, public, etc.)
COPY client/ ./client/

# Install and build React
RUN cd client && npm install && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy server files first
COPY server/package.json server/package-lock.json ./
RUN npm install --production

# Copy server source code
COPY server/ ./

# Copy built React app
COPY --from=builder /app/client/build ./public

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]
