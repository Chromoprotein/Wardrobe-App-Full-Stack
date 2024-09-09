import React, {useEffect, useState} from "react";
import axios from "axios";
import Message from "./Message";
import useReturn from "utils/useReturn";
import { CustomError } from "./interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { navigateWithTimeout } from "utils/navigateWithTimeout";

export default function Logout() {

    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        async function logout() {
            try {
                if(!process.env.REACT_APP_LOGOUT_URI) {
                    return new Error("API URI is not defined")
                }
                const response = await axios.post(process.env.REACT_APP_LOGOUT_URI, {}, {
                    withCredentials: true
                });
                setMessage(response.data.message);
                navigateWithTimeout(navigate, "/landing");
            } catch (error) {
                console.error('Logout failed', error);
                const err = error as CustomError;
                const errorMessage = err.response?.data?.message || "An unknown error occurred"; 
                setMessage("Error: " + errorMessage);
            }
        }
        logout();
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userRole');
    }, [navigate])

    return (
        <>
            {message && <Message>{message}</Message>}
        </>
    );
}