FROM node:23
WORKDIR /app

# Copy root package files for dependency management
COPY package*.json nest-cli.json tsconfig*.json ./

# Install root dependencies
RUN npm ci

# Copy specific service files
COPY ./apps/admin ./apps/admin

# Production artifacts
EXPOSE 3003
CMD ["npm", "run", "start:dev:admin"]