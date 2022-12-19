import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/authContext";

export const PrivateRoute = () => {
	const { user } = useAuth();
	const location = useLocation();

	return user ? (
		<Outlet />
	) : (
		<Navigate
			to={{ pathname: "/login"}}
			state={{ from: location }}
			replace
		/>
	);
};
