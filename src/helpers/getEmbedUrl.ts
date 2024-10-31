export const getEmbedURL = (
	url?: string
): null | {
  platform: VideoPlatformTypes;
  url: string;
} => {
	if (!url) return null;

	if (isYouTubeLink(url)) {
		return {
			platform: 'youtube',
			url: getYouTubeEmbedURL(url),
		};
	}
	if (isVimeoLink(url)) {
		return {
			platform: 'vimeo',
			url: getVimeoEmbedURL(url),
		};
	}
	if (isDailyMotionLink(url)) {
		return {
			platform: 'dailymotion',
			url: getDailyMotionEmbedURL(url),
		};
	}
	if (isFacebookLink(url)) {
		return {
			platform: 'facebook',
			url: getFacebookEmbedURL(url),
		};
	}
	if (isTwitchLink(url)) {
		return {
			platform: 'twitch',
			url: getTwitchEmbedURL(url),
		};
	}
	if (isTikTokLink(url)) {
		return {
			platform: 'tiktok',
			url: getTikTokEmbedURL(url),
		};
	}
	if (isInstagramLink(url)) {
		return {
			platform: 'instagram',
			url: getInstagramEmbedURL(url),
		};
	}

	return null;
};

export const isYouTubeLink = (url: string) => {
	return url.includes('youtube.com') || url.includes('youtu.be');
};

export const getYouTubeEmbedURL = (url: string) => {
	if (url.includes('/shorts/')) {
		// Handle YouTube Shorts
		const videoId = url.split('/shorts/')[1]?.split('?')[0];
		return `https://www.youtube.com/embed/${videoId}`;
	} else {
		// Handle regular YouTube video
		const videoId =
      url.split('v=')[1] || url.split('youtu.be/')[1]?.split('?')[0];
		return `https://www.youtube.com/embed/${videoId}`;
	}
};

export const isVimeoLink = (url: string) => {
	return url.includes('vimeo.com');
};

export const getVimeoEmbedURL = (url: string) => {
	const videoId = url.split('vimeo.com/')[1];
	return `https://player.vimeo.com/video/${videoId}`;
};

export const isInstagramLink = (url: string) => {
	return url.includes('instagram.com/p/');
};

export const isDailyMotionLink = (url: string) => {
	return url.includes('dailymotion.com');
};

export const getDailyMotionEmbedURL = (url: string) => {
	const videoId = url.split('/video/')[1];
	return `https://www.dailymotion.com/embed/video/${videoId}`;
};

export const isTwitchLink = (url: string) => {
	return url.includes('twitch.tv');
};

export const getTwitchEmbedURL = (url: string) => {
	const channel = url.split('twitch.tv/')[1];
	return `https://player.twitch.tv/?channel=${channel}&parent=yourdomain.com&autoplay=false`;
};

export const getInstagramEmbedURL = (url: string) => {
	return `https://www.instagram.com/p/${url.split('/p/')[1]}/embed/`;
};

export const isTikTokLink = (url: string) => {
	return url.includes('tiktok.com');
};

export const getTikTokEmbedURL = (url: string) => {
	return `https://www.tiktok.com/embed/v2/${url.split('/video/')[1]}`;
};

export const isFacebookLink = (url: string) => {
	return url.includes('facebook.com') && url.includes('/videos/');
};

export const getFacebookEmbedURL = (url: string) => {
	return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
		url
	)}&show_text=0&width=560`;
};
