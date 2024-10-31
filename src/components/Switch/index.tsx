import React from 'react';

interface SwitchProps {
  checked: boolean;
	// eslint-disable-next-line no-unused-vars
  onChange: (checked: boolean) => void;
  size?: string;
}

const Switch: React.FC<SwitchProps> = ({
	checked,
	onChange,
	size = 'w-11 h-6'  // Default size
}) => {
	return (
		<label className='inline-flex items-center cursor-pointer'>
			<div className='relative'>
				<input
					type='checkbox'
					className='sr-only peer'
					checked={ checked }
					onChange={ e => onChange(e.target.checked) }
				/>
				<div
					className={ `
						${size} 
						${checked ? 'bg-purple-500' : 'bg-gray-300'} 
						rounded-full 
						peer 
						peer-checked:after:translate-x-full 
						after:content-[''] 
						after:absolute 
						after:top-[2px] 
						after:left-[2px] 
						after:bg-white 
						after:rounded-full 
						after:h-5 
						after:w-5 
						after:transition-all 
						shadow-[0px_2px_6px_0px_rgba(20,20,43,0.06)]
					` }
				/>
			</div>
		</label>
	);
};

export default Switch;