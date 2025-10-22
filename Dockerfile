FROM node:20-alpine 

RUN npm install -g pnpm

WORKDIR /home/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install 

EXPOSE 3000

CMD ["pnpm", "start:prod"]