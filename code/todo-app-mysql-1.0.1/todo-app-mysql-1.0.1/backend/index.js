const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

process.loadEnvFile('./.env');
const app = express();
const port = process.env.PORT || '3000';
const env = process.env.NODE_ENV || 'development';

const db = require('./config/database').sequelize;
const router = require('./routes');
const connectDB = require('./config/db');

const { UserModel, TodoModel } = require('./models');

// Connection a la base de données mongodb

const initApp = async () => {
  try {
    connectDB();
    console.log('Connexion à la base de données MongoDB établie avec succès.');

    // Synchronize the DB models (if needed for MongoDB, typically handled differently)
    await UserModel.init();
    await TodoModel.init();

    // Serve the frontend static files
    app.use(express.static('../dist'));

    app.use(express.json());
    app.use(cookieParser());

    // API routes
    app.use(router);

    // Serve the frontend index.html file
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    // Start the web server on the specified port.
    app.listen(port, () => {
      console.info(
        `🚀🚀 Le serveur est démarré sur le port ${port} et avec l’environnement: ${env} 🚀🚀`
      );
    });
  } catch (error) {
    console.error('Impossible de se connecter à la base de données', error);
  }
};

initApp();
