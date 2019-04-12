import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import request = require('request');
import { logger } from '../../config/logger.config';
import { Utils } from '../../utils/utils';

export class LinkedinController {

	public static handleLinkedinCallback(req: Request, res: Response) {
		const code = req.query.code;
		const state = req.query.state;

		if (!code || !state) {
			return res.sendStatus(200);
		}

		logger.info(`Linkedin callback for state ${state}`);
	}

	public static getLinkedinUrl(req: Request, res: Response) {

		logger.info('GET /auth/linkedin/url called');

		const linkedinAuthURL = getLinkedinAuthorizationUrl({
			clientId: process.env.LINKEDIN_CLIENT_ID,
			redirectUrl: process.env.LINKEDIN_REDIRECT_URI,
			scope: `${decodeURIComponent('r_liteprofile%20r_emailaddress%20w_member_social')}`,
			state: Utils.getUniqueIdentifier()
		});
		res.status(200).send(linkedinAuthURL);

		function getLinkedinAuthorizationUrl(authParams: LinkedinAuth): string {
			let linkedinUrl = '';
			linkedinUrl += `https://www.linkedin.com/oauth/v2/authorization`;
			linkedinUrl += `?response_type=code`;
			linkedinUrl += `&client_id=${encodeURIComponent(authParams.clientId)}`;
			linkedinUrl += `&redirect_uri=${encodeURIComponent(authParams.redirectUrl)}`;
			linkedinUrl += `&scope=${encodeURIComponent(authParams.scope)}`;
			if (authParams.state) { linkedinUrl += `&state=${encodeURIComponent(authParams.state)}`; }
			return linkedinUrl;
		}
	}

	private static async makePostRequestForAccessToken(authorizationCode: string) {
		let body = '';
		body += 'grant_type=authorization_code';
		body += `&code=${authorizationCode}`;
		body += `&redirect_uri=${process.env.LINKEDIN_CALLBACK_URL}`;
		body += `&client_id=${process.env.LINKEDIN_CONSUMER_KEY}`;
		body += `&client_secret=${process.env.LINKEDIN_CONSUMER_SECRET}`;

		request.post({
			url: 'https://www.linkedin.com/oauth/v2/accessToken',
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			body
		}, LinkedinController.accessTokenCallback);

	}

	private static accessTokenCallback(error: any, response: request.Response, body: any) {
		if (error) {
			console.log(`ERROR1: ${error}`);
		} else {
			const accessToken = JSON.parse(response.body).access_token;
			if (accessToken) {
				LinkedinController.fetchEmailId(accessToken);
			} else {
				logger.error('Access token not received');
				console.log(`ERROR2: ${error}`);
			}
		}
	}

	private static fetchEmailId(accessToken: string) {
		logger.info(`ACCESS TOKEN received`);
		console.log(accessToken);
		const linkedinApiUrl = 'https://api.linkedin.com';
		const url = `${linkedinApiUrl}/v2/emailAddress?q=members&projection=(elements*(handle~))`;

		request.get({
			url,
			headers: { Authorization: `Bearer ${accessToken}` }
		}, (error: any, response: request.Response, body: any) => {
			if (error) {
				console.log(`ERROR1: ${error}`);
			} else {
				const responseBody = JSON.parse(response.body);
				const emailId = responseBody.elements[0]['handle~'].emailAddress;
				this.generateJwt(emailId, accessToken);
			}
		});
	}

	private static generateJwt(emailId: string, accessToken: string) {
		const token = jwt.sign(emailId, accessToken);
		console.log(`Email ID: ${emailId}`);
		console.log(`Access Token: ${accessToken}`);
		console.log(`JWT: ${token}`);
		this.persistData(emailId, accessToken, token);
	}

	private static async persistData(emailId: string, accessToken: string, jsonwebtoken: string): Promise<any> {
		// Add logic to save values to database
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
}

interface LinkedinAuth {
	clientId: string;
	redirectUrl: string;
	scope: string;
	state?: string;
}
