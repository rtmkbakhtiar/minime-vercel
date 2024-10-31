import { NextPage } from 'next';

const NotFoundPage: NextPage = () => {
	return (
		<div className='h-screen text-center flex flex-col items-center justify-center bg-base'>
			<div>
				<h1 className='border-r border-gray-800 text-gray-800 inline-block mr-5 pr-6 text-2xl font-medium align-top leading-[49px]'>404</h1>
				<div className='inline-block text-left'>
					<h2 className='text-sm font-normal text-gray-800 leading-[49px] m-0'>This page could not be found.</h2>
				</div>
			</div>
		</div>
	);
};

export default NotFoundPage;
