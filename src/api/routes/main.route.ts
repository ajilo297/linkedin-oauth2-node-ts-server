import express from 'express';
import { LinkedinController } from '../controllers/linkedin.controller';
import { MainController } from '../controllers/main.controller';

export class MainRoute {

	public static register(app: express.Application) {
		const baseRouteV1 = '/api/v1';
		app.route(`${baseRouteV1}/health`).get(MainController.getHealthInfo);
		app.route(`${baseRouteV1}/shutdown`).get(MainController.shutdownServer);

		app.route(`${baseRouteV1}/auth/linkedin/callback`).get(LinkedinController.handleLinkedinCallback);
		app.route(`${baseRouteV1}/auth/linkedin/url`).get(LinkedinController.getLinkedinUrl);
	}
}
