FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm install --prefer-offline --no-audit

# Copy source
COPY . .

# Build
RUN npm run build

EXPOSE 9000

# Run migrations then start
CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
