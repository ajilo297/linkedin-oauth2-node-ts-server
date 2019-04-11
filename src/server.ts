import express from 'express';
import { App } from './app';
import { logger } from './config/logger.config';

const appInstance: App = new App();
const app: express.Application = appInstance.app;

// Setting up the port for the server
const PORT: number = parseInt(process.env.PORT, 10) || 3000;

// Setting up the host for the server
const HOST: string = process.env.HOST || '0.0.0.0';

// Firing up the server
app.listen(PORT, HOST, () => {
	logger.info(`Server is running at ${process.env.HOST}:${PORT}`);
});
