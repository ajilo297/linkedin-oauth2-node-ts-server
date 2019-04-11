import { Request, Response } from 'express';
import { logger } from '../../config/logger.config';
export class MainController {
	public static async getHealthInfo(req: Request, res: Response) {
		logger.info('GET /health called');
		res.status(200).json({ status: 'up' });
	}
}
