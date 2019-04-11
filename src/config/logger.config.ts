import os from 'os';
import name from 'project-name';
import { createLogger, format, Logger, transports } from 'winston';

const { timestamp, printf, combine, colorize } = format;
const logFormat = printf((info) => {
	let formatString = '';
	formatString += `${info.timestamp}|${getHost()}|${name('sequoia-community-referral')}|`;
	formatString += `${process.env.npm_package_version}|${info.level}|${process.pid}|winston|`;
	formatString += `${info.message.split('\n')[0]}`;
	return formatString;
});

export const logger: Logger = createLogger({
	format: combine(timestamp(), logFormat, colorize()),
	transports: [
		new transports.Console({ level: process.env.NODE_ENV === 'production' ? 'error' : 'debug' }),
		new transports.File({ filename: 'debug.log', level: 'debug' })
	]
});

if (process.env.NODE_ENV !== 'production') {
	logger.debug('Logging initialized at debug level');
}

function getHost(): string {
	const networkInterfaces = os.networkInterfaces();
	const addresses: string[] = [];
	Object.keys(networkInterfaces).forEach((key) => {
		const networkObjects = networkInterfaces[key];
		networkObjects.forEach((networkObject) => {
			if (networkObject.family !== 'IPv4' || networkObject.internal === true) {
				addresses.push(networkObject.address);
			}
		});
	});
	return addresses[0] || 'localhost';
}

export class LoggerStream {
	public static write(message: string) {
		logger.info(message.substring(0, message.lastIndexOf('\n')));
	}
}
