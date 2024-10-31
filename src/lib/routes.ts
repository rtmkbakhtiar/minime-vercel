import images from '@/constant/data/images';

export const ROOT_PREFIX = '/app';
export const ROOT = '/';
export const USER_DASHBOARD_ROUTE = ROOT_PREFIX + '/dashboard';
export const ADMIN_DASHBOARD_ROUTE = ROOT_PREFIX + '/admin/dashboard';

export const PRIVATE_ROUTES = [
	USER_DASHBOARD_ROUTE,
	ADMIN_DASHBOARD_ROUTE,
	ROOT_PREFIX + '/bot',
	ROOT_PREFIX + '/onboarding'
];

export const ADMIN_PRIVATE_ROUTES = [
	ADMIN_DASHBOARD_ROUTE
];

export const userNavigation = [
	{
		id: 1,
		label: 'Dashboard',
		icon: { outline: images.icons.house, filled: images.icons.houseFilled },
		link: USER_DASHBOARD_ROUTE
	}
];

export const adminNavigation = [
	{
		id: 1,
		label: 'Dashboard',
		icon: { outline: images.icons.house, filled: images.icons.houseFilled },
		link: ADMIN_DASHBOARD_ROUTE
	}
];