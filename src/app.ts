import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import { MainRoute } from './api/routes/main.route';

dotenv.config({ path: '.env' });

export class App {
	public app: express.Application;
	public route: MainRoute;

	constructor() {
		this.app = express();
		this.configureServer();
		this.setupRoutes();
	}

	/**
	 * Configure server and setup the middlewares
	 */
	private configureServer() {
		this.app.use(bodyParser.json());
		this.app.use(
			bodyParser.urlencoded({
				extended: true
			})
		);
	}

	/**
	 * Register routes
	 */
	private setupRoutes() {
		this.route = new MainRoute();
		MainRoute.register(this.app);
	}
}
