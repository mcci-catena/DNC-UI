import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        console.log('UseToken, Read Token');
        const userToken = JSON.parse(tokenString);
        return userToken?.token;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken) => {
        console.log('Store Token');
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token
    };
}
