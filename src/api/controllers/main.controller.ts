import { Request, Response } from 'express';
import _ from 'lodash';
import md5 from 'md5';
import { logger } from '../../config/logger.config';
import { Utils } from '../../utils/utils';

export class MainController {
	public static async getHealthInfo(req: Request, res: Response) {
		logger.info('GET /health called');
		res.status(200).json({ status: 'up' });
	}

	public static shutdownServer(req: Request, res: Response) {

		const adminKey = req.headers.admin_key;

		if (_.isUndefined(adminKey) || _.isEmpty(adminKey)) {
			return res.status(400).send(Utils.error400('Admin Key is required'));
		}

		const key = process.env.ADMIN_KEY;
		if (adminKey !== key) {
			return res.status(401).send(Utils.getJsonErrorMessage('Unauthorized', 401, 'Incorrect Admin Key'));
		}

		res.sendStatus(200);
		logger.info('GET /shutdown called');
		logger.info('Shutting down...');
		process.exit(0);
	}
}
