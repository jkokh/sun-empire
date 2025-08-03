# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package metadata
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy frontend package.json if it exists
COPY frontend/package.json frontend/package-lock.json ./frontend/

# Install frontend dependencies
RUN cd frontend && npm install

# Copy application source code
COPY . .

# Copy production environment variables
COPY .env.prod .env

# Build the application
RUN npm run build-all

# Expose the application port
EXPOSE 8084

# Install netcat and MySQL client for the startup script
RUN apt-get update && apt-get install -y netcat-openbsd default-mysql-client && rm -rf /var/lib/apt/lists/*

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Start the application using the startup script
CMD ["/app/start.sh"]
