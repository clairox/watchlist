import React from 'react';

type ButtonProps = {
	children: React.ReactNode;
	type?: 'button' | 'submit' | 'reset' | undefined;
	theme?: 'light' | 'dark';
	level?: 'normal' | 'danger';
	disabled?: boolean;
	onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Button: React.FunctionComponent<ButtonProps> = ({
	children,
	type,
	theme = 'dark',
	level = 'normal',
	disabled = false,
	onClick,
}) => {
	const themeStyle = () => {
		if (disabled) return;

		switch (theme) {
			case 'light':
				return 'bg-gray-300 text-black';
			default:
				return 'bg-gray-700 text-gray-100';
		}
	};

	const levelStyle = () => {
		if (disabled) return;

		switch (level) {
			case 'danger':
				return 'hover:bg-red-600 hover:text-white';
			default:
				return 'hover:bg-green-500 hover:text-black';
		}
	};

	const disabledStyle = () => {
		switch (disabled) {
			case true:
				return 'bg-gray-700 text-gray-500';
			default:
				return 'hover:cursor-pointer';
		}
	};
	return (
		<button
			className={`rounded-full ${themeStyle()} ${levelStyle()} ${disabledStyle()} py-2  px-5 text-gray-100`}
			type={type}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default Button;
