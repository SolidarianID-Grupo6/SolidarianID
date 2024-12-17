FROM node:23
WORKDIR /app

# Copy root package files for dependency management
COPY package*.json nest-cli.json tsconfig*.json ./

# Install root dependencies
RUN npm ci

# Copy specific service files
COPY apps/communities ./apps/communities
COPY . .

# Build specific service
RUN npm run build:communities

RUN ls dist/apps/communities

# Production artifacts
EXPOSE 3001
CMD ["node", "dist/apps/communities/main"]