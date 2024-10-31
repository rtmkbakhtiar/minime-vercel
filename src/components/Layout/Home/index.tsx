import React from 'react';
import dynamic from 'next/dynamic';

import { NavbarProps } from '../../Navbar';
import SEO, { SEOProps } from '../../SEO';

type LayoutProps = {
	seoConfig?: SEOProps;
	children: React.ReactNode;
	className?: string;
	navbarProps?: NavbarProps;
};

const Navbar = dynamic(() => import('../../Navbar'), { ssr: false });

const Layout: React.FC<LayoutProps> = ({
	children,
	seoConfig,
	className = 'bg-white',
	navbarProps
}) => {
	const renderNavbar = () => {
		return (
			<Navbar { ...navbarProps } />
		);
	};

	return (
		<div className={ className }>
			{ seoConfig && <SEO { ...seoConfig } /> }

			{ renderNavbar() }

			{ children }
		</div>
	);
};

export default Layout;