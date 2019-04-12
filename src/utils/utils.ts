export class Utils {

	/**
	 * Returns the error JSON object
	 * @param error Error Title
	 * @param errorCode Error Code
	 * @param errorDescription Error Description
	 */
	public static getJsonErrorMessage(error: string, errorCode: number, errorDescription?: string): object {
		if (errorDescription) {
			return { error, error_code: errorCode, error_description: errorDescription };
		}
		return { error, error_code: errorCode, error_description: error };
	}

	public static error400(message?: string): object { return this.getJsonErrorMessage('Bad Request', 400, message); }

	public static error404(message?: string): object { return this.getJsonErrorMessage('Not Found', 404, message); }

	public static error500(message?: string): object { return this.getJsonErrorMessage('Internal Error', 500, message); }
}
