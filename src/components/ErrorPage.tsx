import React from "react";
import { Helmet } from "react-helmet";

type Props = {
	code: number,
	message: string
}

export const ErrorPage: React.FunctionComponent<Props> = ({ code, message }) => {
	return (
		<div className="h-fit">
			<Helmet>
				<title>{code.toString()}</title>
			</Helmet>
			<div className="mx-auto pt-[200px] flex flex-col justify-center">
				<h1 className="mr-20 text-6xl font-bold text-gray-400">
					{code}:
				</h1>
				<p className="ml-10 mt-2 text-lg text-gray-100">{message}</p>
			</div>
		</div>
	);
};
