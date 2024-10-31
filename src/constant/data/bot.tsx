import { BotResp } from '@/openapi';

export interface BotData extends BotResp {
  meta_base_url?: string;
}

const generalBotData: { [key: string]: BotData } = {
	// eslint-disable-line no-unused-vars
	visionsee: {
		welcome_msg:
      'Hey! I’m Vision See, your own AI Vision Agent. Feel free to send me pics and ask questions...',
		description: `
		Hey! I'm Vision See, your own AI Vision Agent. You can ask me questions about  pictures and I will share my thoughts with you.
		\n\n
		How it works? \n
		🖼 Drop me a picture \n
		❓ Ask a Question \n
		💬 I'll reply with my answer
		`,
		name: 'Vision See',
		short_description:
      'I’m Vision See, your own AI Vision Agent. You can ask me questions about images and I will share my thoughts with you.',
		avatar: '/images/avatar/vision_see.webp',
		meta_title: 'Vision See MiniMe',
		meta_description:
      '👋 Welcome to my MiniMe! I’m Vision See, your own AI Vision Agent. You can ask me questions about images and I will share my thoughts with you.',
		meta_image:
      process.env.NEXT_PUBLIC_BASE_URL_S3 + '/meta/vision_thumbnail.jpeg',
	},
	sosan: {
		name: 'SimplySosan',
		avatar: '/images/avatar/sosan.webp',
		// owner: '@sosan',
		welcome_msg:
      'Hey, welcome to my Minime 😊!\n\nHere you can ask me questions about:\n\n🥕 Nutrition and Diet\n🥦 Healthy Eating Habits and Choices\n🧁 High Blood Sugar and Diabetes\n🩸 Cholesterol\n\nHow can I help?',
		description: `
			I'm the founder of SimplySosan, with more than 20 years of experience as a dietitian, now turned into a passionate healthy lifestyle expert. 💝
			\n\n
			My mission is to empower you to invest in your health and well-being. 😊
			\n\n
			Ask me about:\n
			🥕 Nutrition and Diet\n
			🥦 Healthy Eating Habits and Choices\n
			🧁 High Blood Sugar\n
			🩸 Cholesterol
			`,
		short_description:
      'I\'m the founder of SimplySosan, with more than 20 years of experience as a dietitian, now turned into a passionate healthy lifestyle expert. 💝 My mission is to empower you to invest in your health and well-being. 😊',
		meta_title: 'SimplySosan MiniMe',
		meta_description:
      '👋 Welcome to my Minime! I\'m Sosan, the founder of SimplySosan. Healthy Lifestyle Expert. 💝 This is my Digital Twin. Ask me any questions about healthy lifestyle. Excited to help you!',
		meta_image:
      process.env.NEXT_PUBLIC_BASE_URL_S3 + '/meta/sosan_thumbnail.jpeg',
	},
	susy: {
		welcome_msg: 'Hey, I’m Susy. I’m from Holland. How about you?',
		description: `
		🌷 Hello, I'm Susy! 💋<br/>
		📍Amsterdam, Netherlands<br/><br/>
		Dutch delight with a dash of spice! Join me on a colorful journey through my daily escapades, where I share exclusive, intimate moments from the heart of Holland.<br/><br/>
		Why subscribe? Here's what you'll get:<br/>
		✨ Exclusive photos and videos you won't see anywhere else<br/>
		✨ Behind-the-scenes looks at my Dutch lifestyle and travels<br/>
		✨ Direct interaction with me – your Dutch connection!<br/>
		✨ Special surprises just for my subscribers!<br/><br/>
		Ready to explore the beauty of the Netherlands through a local's eyes? 💖 Subscribe now and let's make every day extraordinary!<br/><br/>
		🌟 Subscribe for a genuine slice of Dutch life, served fresh and fun. See you inside! 😘
		`,
		name: 'Susy',
		short_description:
      '👋 Your own Dutch girlfriend. I’m excited to meet you 💋Send me a message.',
		avatar: '/images/avatar/susy.webp',
		meta_title: 'Susy MiniMe',
		meta_description:
      '👋 Your own Dutch girlfriend. I’m excited to meet you 💋Send me a message.',
		meta_image:
      process.env.NEXT_PUBLIC_BASE_URL_S3 + '/meta/susy_thumbnail.jpeg',
	},
	johnlee: {
		welcome_msg: 'Tell me, how can I help?',
		description: `I'm John Lee, an internationally renowned Entrepreneur, Investor, Speaker, and Mentor. I am highly passionate about helping others build their businesses. \n\nAsk me about:\n✅ Building a business\n✅ Fundraising\n✅ Business mentoring\n✅ Real estate investment & more\n
		`,
		name: 'John Lee',
		short_description:
      'I\'m John Lee, an Internationally renowned Entrepreneur, Investor, Speaker and Mentor. This is my Digital Twin. Ask me any questions about your business plan or issues. Excited to help you!',
		avatar: '/images/avatar/john.webp',
		meta_title: 'John Lee MiniMe',
		meta_description:
      '👋 Welcome to my Minime! I\'m John Lee, an Internationally renowned Entrepreneur, Investor, Speaker and Mentor. 💝 This is my Digital Twin. Ask me any questions about your business plan or issues. Excited to help you!',
		meta_image:
      process.env.NEXT_PUBLIC_BASE_URL_S3 + '/meta/johnlee_thumbnail.webp',
		meta_base_url: 'https://johnlee-sales.minime.club',
	},
	woochan: {
		welcome_msg:
      'I\'m Woo Chan Lee (이우찬), a successful, award-winning, professional Muay Thai boxer from South Korea. I am now at the Olympic Games Paris 2024 to compete in Muay Thai boxing. As the WMC Featherweight Asian Champion who coaches many other people, I am glad to talk with you here.\n\nAsk me about\n✅ The Olympics\n✅ Muay Thai training\n✅ Muay Thai competition & more.\n',
		short_description: `
		I'm Woo Chan Lee (이우찬), a successful, award-winning, professional Muay Thai boxer from South Korea. I am now at the Olympic Games Paris 2024 to compete in Muay Thai boxing. This is my Digital Twin. Feel free to ask me any questions about Muay Thai or the Olympics. Excited to talk with you!
		`,
		name: 'Woo Chan Lee',
		description: `
		I'm Woo Chan Lee (이우찬), a successful, award-winning, professional Muay Thai boxer from South Korea. I am now at the Olympic Games Paris 2024 to compete in Muay Thai boxing. As the WMC Featherweight Asian Champion who coaches many other people, I am glad to talk with you here.
		\n\n
		Ask me about\n
		✅ The Olympics\n
		✅ Muay Thai training\n
		✅ Muay Thai competition & more.\n
		`,
		avatar: '/images/avatar/woochan.webp',
		meta_title: 'Woo Chan MiniMe',
		meta_description: `
		I'm Woo Chan Lee (이우찬), a successful, award-winning, professional Muay Thai boxer from South Korea. I am now at the Olympic Games Paris 2024 to compete in Muay Thai boxing. This is my Digital Twin. Feel free to ask me any questions about Muay Thai or the Olympics. Excited to talk with you!
		`,
		meta_image:
      process.env.NEXT_PUBLIC_BASE_URL_S3 + '/meta/woochan_thumbnail.webp',
	},
};

export default generalBotData;
