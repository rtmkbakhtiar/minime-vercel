import https from 'https';
import { getSession } from 'next-auth/react';

import {
	AppApi,
	AuthApi,
	BotApi,
	ConversationApi,
	MainBotApi,
	SubscribeApi,
	SubscriptionApi,
} from '../openapi/api';
import { BASE_PATH } from '../openapi/base';
import { Configuration } from '../openapi/configuration';

export class Api {
	private configuration = async() => {
		const session = await getSession();
		const openapiConfig = new Configuration({
			basePath: process.env.NEXT_PUBLIC_BASE_URL_API ?? BASE_PATH,
		});
		openapiConfig.baseOptions = {
			headers: {
				Authorization: `${session?.token ? 'Bearer ' + session?.token : ''}`,
				'ngrok-skip-browser-warning': true,
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		};

		return openapiConfig;
	};

	public authApi = async() => {
		const api = new AuthApi(await this.configuration());
		return api;
	};

	public botsApi = async() => {
		const api = new BotApi(await this.configuration());
		return api;
	};

	public conversationApi = async() => {
		const api = new ConversationApi(await this.configuration());
		return api;
	};

	public mainBotApi = async() => {
		const api = new MainBotApi(await this.configuration());
		return api;
	};

	public appApi = async() => {
		const api = new AppApi(await this.configuration());
		return api;
	};

	public subscribeApi = async() => {
		const api = new SubscribeApi(await this.configuration());
		return api;
	};

	public subscriptionApi = async() => {
		const api = new SubscriptionApi(await this.configuration());
		return api;
	};
}
