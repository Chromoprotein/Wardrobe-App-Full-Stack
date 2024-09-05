import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import useReturn from '../utils/useReturn';
import { useAuth } from '../authContext';
import { CustomError } from './interfaces/interfaces';
import { UserFormProp } from './interfaces/interfaces';
import UserForm from './UserForm';

export default function Register() {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

  const [formData, setFormData] = useState<UserFormProp>({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState<string>("");
  const returnToFrontPage = useReturn();
  const { isAuthenticated, loading, setIsAuthenticated } = useAuth();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const resetMessage = () => {
    setMessage("");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    const disabledChange = !Object.values(formData).every(value => value);
    setIsDisabled(disabledChange)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      if(!process.env.REACT_APP_REGISTER_URI) {
        return new Error("API URI not defined");
      }
      const response = await axios.post(process.env.REACT_APP_REGISTER_URI, formData, { withCredentials: true });
      console.log(response.data);
      if (response.status === 201) {
          const token = response.data.jwt;
          setCookie('jwt', token, { path: '/', secure: true, httpOnly: true }); // Set the JWT token as a cookie
          console.log(response.data)

          setMessage(response.data.message)
          setIsAuthenticated(true);
          sessionStorage.setItem('isAuthenticated', 'true');
          returnToFrontPage();
      }
    } catch (error) {
      console.error(error);
      const err = error as CustomError;
      setMessage("Error: " + err.response.data.message);
      setIsDisabled(false);
    }
  };

  return (
    <UserForm title="Register" handleSubmit={handleSubmit} formData={formData} handleChange={handleChange} message={message} resetMessage={resetMessage} isDisabled={isDisabled} />
  );
};