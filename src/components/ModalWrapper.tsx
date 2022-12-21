import React from 'react';

type Props = {
	children: React.ReactNode;
};

const ModalWrapper: React.FunctionComponent<Props> = ({ children }) => {
	return (
		<div className="mx-6 h-fit w-fit max-w-[600px] rounded-xl bg-gray-700 text-white drop-shadow-md md:w-fit">
			{children}
		</div>
	);
};

export default ModalWrapper;
