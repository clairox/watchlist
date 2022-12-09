import React from "react";
import { ErrorPage } from "./ErrorPage";

export const PageNotFoundPage = () => {
	return <ErrorPage code={404} message={"Page Not Found"} />;
};
