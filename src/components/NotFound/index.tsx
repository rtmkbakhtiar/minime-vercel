import { useRouter } from 'next/router';

const NotFound: React.FC = () => {
	const router = useRouter();

	return (
		<div className='h-screen text-center flex flex-col items-center justify-center bg-base'>
			<div>
				<h1 className='border-r border-gray-800 text-gray-800 inline-block mr-5 pr-6 text-2xl font-medium align-top leading-[49px]'>
          404
				</h1>
				<div className='inline-block text-left'>
					<h2 className='text-sm font-normal text-gray-800 leading-[24px] m-0'>
            Oops! The page you are looking for does not exist. <br />
            Go back or head over to{ ' ' }
						<span
							onClick={ () => router.push('/').then(() => router.reload()) }
							className='text-blue-700 hover:text-blue-500 cursor-pointer'
						>
              myminime.ai
						</span>{ ' ' }
            to chose a new direction.
					</h2>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
