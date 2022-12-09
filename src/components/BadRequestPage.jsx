import React from "react";
import { ErrorPage } from "./ErrorPage";

export const BadRequestPage = () => {
	return <ErrorPage code={400} message={"Bad Request"} />;
};
