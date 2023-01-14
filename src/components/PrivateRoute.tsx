import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

//TODO: figure out session stuff
export const PrivateRoute = () => {
	const { user } = useAuth();
	const location = useLocation();

	return user ? <Outlet /> : <Navigate to={{ pathname: '/login' }} state={{ from: location }} replace />;
};
