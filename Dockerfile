FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY client/package*.json client/
COPY backend/package*.json backend/
RUN npm ci

COPY . .
RUN npm run client:build
RUN npx tsc -p backend/tsconfig.json

FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
COPY client/package*.json client/
COPY backend/package*.json backend/
RUN npm ci --omit=dev

COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/client/dist ./client/dist

CMD ["node", "backend/dist/index.js"]
