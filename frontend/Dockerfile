# Stage 1: Build the application
FROM node:24-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
# Copying package.json separately allows Docker to cache the npm install layer
COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# ----> ADD THE TEST STEP HERE <----
# Run the unit tests. If this command fails, the Docker build will stop.
RUN npm run test

# If tests pass, create the production build
RUN npm run build

# Stage 2: Serve with a lightweight static server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]