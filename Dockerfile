FROM node:18-alpine AS builder

WORKDIR /app

# Build React frontend first
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built React app from builder
COPY --from=builder /app/client/build ./client/build

# Copy server files and build
COPY server/package.json server/package-lock.json ./
RUN npm install --production

# Copy server source
COPY server/ ./

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]
