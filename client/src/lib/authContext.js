import axios from 'axios';
import { useEffect, useState, useContext, createContext } from 'react';

const authContext = createContext();

export const ProvideAuth = ({ children }) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
    return useContext(authContext);
}

const useProvideAuth = () => {
    const [user, setUser] = useState(localStorage.getItem('user'));

    const reqConfig = { withCredentials: true };
    
    const apiPath = 'http://' + process.env.REACT_APP_PATH;

    const login = async loginData => {
        return await axios.post(`${apiPath}/login`, loginData, reqConfig)
        .then(res => {
            setUser(res.data);
            localStorage.setItem('user', res.data)
            return { status: res.status };
        })
        .catch(err => {
            setUser(null);
            return { status: err.response.status };
        });
    }
 
    const signup = async signupData => {
        return await axios.post(`${apiPath}/signup`, signupData, reqConfig)
        .then(res => {
            setUser(res.data);
            localStorage.setItem('user', res.data)
            return { status: res.status };
        })
        .catch(err => {
            setUser(null);
            return { status: err.response.status };
        });
    }

    const logout = async () => {
        return await axios.get(`${apiPath}/logout`, reqConfig)
        .then(() => {
            setUser(null);
            localStorage.removeItem('user');
        });
    }

    const logoutIfUserDoesntExist = async () => {
        return await axios.get(`${apiPath}/checkUserExists`, reqConfig)
        .then(async res => {
            if (!res.data) {
                await logout();
            }
        });
    }
    
    const checkEmailAvailability = async email => {
        return await axios.get(`${apiPath}/user/checkEmailAvailability/${email}`, reqConfig)
        .then(res => res.data);
    }

    //TODO: maybe change this? 
    useEffect(() => {
        axios.get(`${apiPath}/user`, { withCredentials: true })
        .then(res => {
            if (res.data) {
                setUser(res.data)
                localStorage.setItem('user', res.data);
            }
            else {
                setUser(null);
                localStorage.removeItem('user');
            }
        })
        .catch(() => {
            setUser(null);
            localStorage.removeItem('user');
        })
    }, [apiPath])

    return {
        user,
        login,
        signup,
        logout,
        logoutIfUserDoesntExist,
        checkEmailAvailability
    };
}