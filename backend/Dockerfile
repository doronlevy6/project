# Choose the base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package*.json files first
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy other application files
COPY . .

# Start the application
CMD [ "npm", "run", "dev" ]
