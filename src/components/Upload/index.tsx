import { cn } from '@/lib/utils';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	wrapperClassName?: string;
}

export const getBase64 = (file: File | null) => {
	return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		} else {
			resolve('');
		}
	});
};

const Upload: React.FC<InputProps> = ({
	id,
	name,
	onChange,
	children,
	wrapperClassName,
	...props
}) => {
	return (
		<div className={ cn('relative', wrapperClassName) }>
			<label htmlFor={ id }>
				<div className='flex justify-center'>
					{ children }
					<input
						id={ id }
						name={ name }
						type='file'
						className='sr-only'
						accept='image/*'
						multiple={ false }
						onChange={ onChange }
						{ ...props }
					/>
				</div>
			</label>
		</div>
	);
};

export default Upload;
