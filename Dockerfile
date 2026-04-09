FROM node:18-alpine

WORKDIR /app

# Copy server files
COPY server/package.json server/package-lock.json ./

# Copy client build files
COPY client/build ./client/build

# Install dependencies
RUN npm install --production

# Copy server code
COPY server/ ./

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]
