# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Install Python and build tools
RUN apk add --no-cache python3 make g++ 

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt for the correct architecture
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "run", "start:prod"]
