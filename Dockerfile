
FROM node:16

# Arbeitsverzeichnis setzen
WORKDIR /app

# Package.json kopieren und Abhängigkeiten installieren
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# App-Dateien kopieren (Backend und Public)
WORKDIR /app
COPY backend ./backend
COPY public ./public

# Port freigeben
EXPOSE 3000

# Startbefehl
CMD ["node", "backend/server.js"]
