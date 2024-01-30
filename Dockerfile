# Use a smaller base image
FROM node:14-alpine

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["node", "main.js"]
