const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app  = express ();

// Configuration selon l'environnement
const isProduction = process.env.NODE_ENV === 'production';

// Liste des origines autorisées
const allowedOrigins = [
  'http://localhost:4200', // Développement local
  'https://projet-lis-ambre.onrender.com', 
  'https://templateweb-latest-4240.onrender.com', // NOUVEAU : Frontend Render actuel
  process.env.FRONTEND_URL // URL configurée via variable d'environnement
].filter(Boolean); // Enlever les valeurs undefined

var corsOptions = {
  origin: function (origin, callback) {
    // ...log supprimé...
    // Autoriser les requêtes sans origin (ex: Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      // ...log supprimé...
      callback(null, true);
    } else {
      // ...log supprimé...
      // ...log supprimé...
      callback(new Error('Non autorisé par CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

// ...logs supprimés...

app.use(cors(corsOptions));
app.use(cookieParser());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to CNAM application." });
});

const db = require("./models");

db.sequelize.sync({ alter: true })
  .then(() => {
    // ...log supprimé...
  })
  .catch((err) => {
    // ...log supprimé...
  });

require("./routes")(app);
require("./routes")(app);

// Gestionnaire d'erreur global Express (à placer après les routes)
app.use((err, req, res, next) => {
  console.error('--- ERREUR EXPRESS GLOBALE ---');
  console.error(err);
  if (err instanceof Error && err.message) {
    res.status(500).json({ message: err.message, error: err });
  } else {
    res.status(500).json({ message: 'Erreur serveur inconnue', error: err });
  }
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // ...logs supprimés...
});

