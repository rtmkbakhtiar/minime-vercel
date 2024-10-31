type OgObject = {
  success?: boolean;
  ogTitle?: string;
  ogType?: string;
  ogUrl?: string;
  ogDescription?: string;
  ogImage?: {
    height?: string | number;
    type?: string;
    url?: string;
    width?: string | number;
    alt?: string;
  }[];
};

type Dimensions = {
  width: number;
  height?: number;
};

type BotAgent = 'visionsee' | 'sosan' | 'susy' | 'johnlee';

type FormChatData = {
  question: string;
};

type ChatItem = {
  role: string;
  content: string | React.ReactNode;
  loading?: boolean;
  msg_code?: string;
  rating?: number;
  openGraph?: OgObject | null;
  url?: string;
};

type ChatContentItem = Omit<ChatItem, 'role' | 'avatar'>;

type GroupingChatItem = {
  role: string;
  contents: ChatContentItem[];
};

type BotGeneralData = {
  id: string;
  introMessage?: string;
  description: string;
  name: string;
  shortDescription?: string;
  image: string;
  owner?: string;
};

type ObjectKey<T = any> = { [key: string]: T };

type VideoPlatformTypes =
  | 'youtube'
  | 'vimeo'
  | 'tiktok'
  | 'facebook'
  | 'twitch'
  | 'instagram'
  | 'dailymotion';
