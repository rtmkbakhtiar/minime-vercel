import https from 'https';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth/next';

import { LayoutBotIntroduction, LayoutHome } from '@/components';
import NotFound from '@/components/NotFound';
import { Api } from '@/lib/api';
import { BotResp } from '@/openapi';

import { authOptions } from '../../api/auth/[...nextauth]';

const apiInstance = new Api();

type BotHomePageProps = {
  data: BotResp;
};

const BotHomePage: NextPage<BotHomePageProps> = ({ data }) => {
	if (data?.code !== '') {
		return (
			<LayoutHome
				seoConfig={ {
					title: data?.meta_title,
					description: data?.meta_description,
					image: data?.meta_image,
				} }
				className='bg-neutral-white'
			>
				<LayoutBotIntroduction botData={ data } />
			</LayoutHome>
		);
	} else {
		return <NotFound />;
	}
};

export default BotHomePage;

export const getServerSideProps: GetServerSideProps = async ctx => {
	const codeAlias = (ctx.params?.code ?? '') as string;

	try {
		const session = await getServerSession(ctx.req, ctx.res, authOptions);
		const botDetailResponse = await (
			await apiInstance.botsApi()
		).getBotDetail(codeAlias, {
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			headers: {
				Authorization: `${session?.token ? 'Bearer ' + session?.token : ''}`,
			},
		});

		return {
			props: {
				data: botDetailResponse?.data?.data,
			},
		};
	} catch (error) {
		return {
			props: {
				data: {
					creator_name: '',
					code: '',
					bot_alias: codeAlias,
					name: '',
					avatar: '',
					api_url: '',
					is_online: false,
					req_status: 0, // 0=new, 1=accepted, 2=declined
					welcome_msg: '',
					created_at: '',
				} as BotResp,
			},
		};
	}
};
