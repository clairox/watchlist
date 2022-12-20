import axios from 'axios';
import { useAuth } from './authContext';

const baseURL = process.env.REACT_APP_API_PATH;
const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.response.use(
	res => res,
	err => {
		if (err.response.status === 409) return err;

		switch (err.response.status) {
			case 400:
				window.location.href = '/400';
				break;
			case 401:
				useAuth().logout!();
				break;
			case 500:
				window.location.href = '/500';
				break;
			default:
				break;
		}
		return Promise.reject(err);
	}
);

export default axiosInstance;
