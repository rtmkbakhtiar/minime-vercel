import React, { PropsWithChildren } from 'react';
import Link, { LinkProps } from 'next/link';

import { filterObject } from '@/helpers/misc';

const QueryLink: React.FC<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & PropsWithChildren & React.RefAttributes<HTMLAnchorElement>> = ({ href, ...props }) => {
	const pathname = typeof href === 'object' ? href.pathname : href;

	const queryProps =
		typeof href === 'object' && typeof href.query === 'object'
			? href.query
			: {};

	const filteredQuery = filterObject({
		...queryProps
	});

	return (
		<Link
			{ ...props }
			href={ {
				pathname,
				query: filteredQuery
			} }
		/>
	);
};

export default QueryLink;