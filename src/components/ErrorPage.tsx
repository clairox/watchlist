import React from "react";

type Props = {
	code: number,
	message: string
}

export const ErrorPage: React.FunctionComponent<Props> = ({ code, message }) => {
	return (
		<div className="h-screen bg-white">
			<div className="mx-auto mt-[200px] flex flex-col justify-center">
				<h1 className="mr-20 text-6xl font-bold text-red-500">
					{code}:
				</h1>
				<p className="ml-10 mt-2 text-lg">{message}</p>
			</div>
		</div>
	);
};
