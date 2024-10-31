import { PaginationProps } from '@/components/DataTable';

{ /* eslint-disable no-unused-vars */ }

export interface ResponseSendMsg {
	answer: string;
}

export interface PaginationState extends PaginationProps {
	prev?: string;
	next?: string;
}

export enum BotStatus {
	PENDING = 0,
	ACTIVE = 1,
	INACTIVE = 2
}

export enum CreateBotReqStatus {
	NO = 0,
	YES = 1,
	UNSURE = 2
}