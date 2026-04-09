FROM node:18-alpine AS builder

WORKDIR /app

# Copy entire client folder (including src, public, etc.)
COPY client/ ./client/

# Install and build React
RUN cd client && npm install && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built React app from builder
COPY --from=builder /app/client/build ./public

# Copy server files
COPY server/package.json server/package-lock.json ./
RUN npm install --production

# Copy server source code
COPY server/ ./

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]
