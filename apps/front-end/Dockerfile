FROM node:23
WORKDIR /app

# Copy root package files for dependency management
COPY package*.json nest-cli.json tsconfig*.json ./

# Install root dependencies
RUN npm ci

# Copy specific service files
COPY ./apps/front-end ./apps/front-end
COPY ./apps/front-end/public ./dist/apps/front-end/public
COPY ./apps/front-end/views ./dist/apps/front-end/views

# Production artifacts
EXPOSE 3004
CMD ["npm", "run", "start:dev:front-end"]