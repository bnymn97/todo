
FROM node:16

WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

WORKDIR /app
COPY backend ./backend
COPY public ./public

EXPOSE 3000

CMD ["node", "backend/server.js"]
