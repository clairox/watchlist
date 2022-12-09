import React from "react";
import { ErrorPage } from "./ErrorPage";

export const InternalServerErrorPage = () => {
	return <ErrorPage code={500} message={"Internal Server Error"} />;
};
