FROM node:20-alpine

WORKDIR /app

# Force fresh build - v2
RUN echo "Build timestamp: $(date)"

# Install dependencies
COPY package*.json ./
RUN npm install --prefer-offline --no-audit

# Copy source
COPY . .

# Build admin and server
RUN npm run build

EXPOSE 9000

# Run migrations then start
CMD ["sh", "-c", "npx medusa db:migrate && npm run start"]
