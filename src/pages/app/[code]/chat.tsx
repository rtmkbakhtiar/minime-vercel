import https from 'https';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth/next';

import { LayoutHome } from '@/components';
import ChatContainer from '@/components/ChatContainer';
import NotFound from '@/components/NotFound';
import { Api } from '@/lib/api';
import { BotResp, InitConvResp } from '@/openapi';

import { authOptions } from '../../api/auth/[...nextauth]';

const apiInstance = new Api();

type ChatPageProps = {
  botData: BotResp;
  conversationConfig: InitConvResp;
};

const ChatPage: NextPage<ChatPageProps> = ({ conversationConfig, botData }) => {
	if (botData?.code) {
		return (
			<LayoutHome
				seoConfig={ {
					title: botData?.meta_title,
					description: botData?.meta_description,
					image: botData?.meta_image,
				} }
				className='bg-neutral-white'
			>
				<ChatContainer
					botData={ botData }
					conversationConfig={ conversationConfig }
				/>
			</LayoutHome>
		);
	}

	return <NotFound />;
};

export default ChatPage;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const codeAlias = (ctx.params?.code ?? '') as string;
	let conversationConfig: InitConvResp | undefined = {
		cent_token: '',
		conv_code: '',
	};
	let botData: BotResp | undefined = {
		creator_name: '',
		code: '',
		bot_alias: codeAlias,
		name: '',
		avatar: '',
		description: '',
		short_description: '',
		is_online: false,
		req_status: 0, // 0=new, 1=accepted, 2=declined
		welcome_msg: '',
		created_at: '',
		tags: [],
		meta_title: '',
		meta_image: '',
		meta_description: '',
	};

	try {
		const session = await getServerSession(ctx.req, ctx.res, authOptions);
		const axiosOptions = {
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			headers: {
				Authorization: `${session?.token ? 'Bearer ' + session?.token : ''}`,
			},
		};
		const botDetailResponse = await (
			await apiInstance.botsApi()
		).getBotDetail(codeAlias, axiosOptions);
		botData = botDetailResponse?.data?.data;
		const initConvResponse = await (
			await apiInstance.conversationApi()
		).initConversation(botData?.code ?? '', axiosOptions);
		conversationConfig = initConvResponse?.data?.data;

		return {
			props: {
				botData: botData,
				conversationConfig,
			},
		};
	} catch (error) {
		return {
			props: {
				botData: botData,
				conversationConfig: conversationConfig,
			},
		};
	}
};
