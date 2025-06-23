# 📝 ToDo App

Ein einfaches ToDo-Listen-Webprojekt mit Benutzerregistrierung, Login, Aufgabenverwaltung (CRUD) und JWT-Authentifizierung.
Die Anwendung besteht aus einem **Frontend (HTML/CSS/JS)** und einem **Node.js/Express Backend**, betrieben mit **MySQL** und **Docker**.

## 🚀 Features

- ✅ Benutzerregistrierung & Login mit JWT
- 🔐 Passwort-Hashing mit bcrypt
- ➕ Aufgaben erstellen
- ✏️ Aufgaben aktualisieren
- ✅ Aufgaben als erledigt markieren
- ❌ Aufgaben löschen
- 📂 Filter: Aktive / Erledigte Aufgaben
- 🐳 Docker-basierter Setup für einfache Bereitstellung

---

## 📦 Projektstruktur

```plaintext
.
├── backend/              # Express.js Backend
│   ├── routes/           # Auth & Task Routen
│   ├── db.js             # MySQL-Verbindung
│   ├── server.js         # Einstiegspunkt
├── public/               # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   ├── script.js
├── init.sql              # SQL-Init für MySQL
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

## 🛠️ Setup (Lokal)
1. Voraussetzungen
Node.js

Docker und Docker Compose

2. .env Datei
Erstelle eine Datei .env im Projektverzeichnis:
- DB_HOST=db
- DB_USER=root
- DB_PASSWORD=1234
- DB_NAME=todo_app
- JWT_SECRET=super-secret-key
3. Start mit Docker
- docker-compose up --build
🔗 App erreichbar unter: http://localhost:3000

