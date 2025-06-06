# Use an official Node image
FROM node:24-alpine AS build

# Set working directory
WORKDIR /app

# Copy frontend files
COPY . .

# Install dependencies and build the app
RUN npm install && npm run build

# Serve with a lightweight static server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
