FROM node:23
WORKDIR /app

# Copy root package files for dependency management
COPY package*.json nest-cli.json tsconfig*.json ./

# Install root dependencies
RUN npm ci

# Copy specific service files
COPY ./apps/front-end ./apps/front-end
COPY ./apps/front-end/src/views ./apps/front-end/src/views
COPY ./apps/front-end/src/public ./apps/front-end/src/public

# Expose the application port
EXPOSE 3004
CMD ["npm", "run", "start:dev:front-end"]
