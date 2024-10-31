import { useEffect } from 'react';

import { isEmptyObject } from '@/helpers/misc';

const useCentrifugo = <T = unknown>(
	url: string | URL,
	props: { token: string; channel: string; },
	onData: (data: T) => void // eslint-disable-line no-unused-vars
) => {
	useEffect(() => {
		let eventSource: EventSource;

		if (url && props.token && props.channel) {
			const urlEventSource = new URL(url);
			urlEventSource.searchParams.append('cf_connect', JSON.stringify({
				'token': props.token,
				'subs': { [props.channel]: {} }
			}));
			eventSource = new EventSource(
				urlEventSource,
				{ withCredentials: true }
			);

			eventSource.onmessage = (e: MessageEvent) => {
				if (!isEmptyObject(e.data)) {
					const data = JSON.parse(e.data);

					if (data.pub) {
						onData(data.pub.data as T);
					}
				}
			};

			// Clean up function
			return () => {
				// Close the EventSource connection
				eventSource.close();
			};
		}
	}, [url, props.token, props.channel]);
};

export default useCentrifugo;