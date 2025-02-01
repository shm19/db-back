# Use the official Node.js image as a base
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port that the backend server listens on
EXPOSE 8000

# Define the command to run the backend server
CMD ["node", "index.js"]
