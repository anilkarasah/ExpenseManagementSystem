const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception! Shutting down...');
  console.log(`${err.name}: ${err.message}`);
  process.exit(1);
});

const app = require('./app');
dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}. NODE_ENV = ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection! Shutting down...');
  console.log(`${err.name}: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
