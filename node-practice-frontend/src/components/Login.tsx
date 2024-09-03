import React, { useState } from 'react';
import axios from 'axios';
import useReturn from '../utils/useReturn';
import { useAuth } from '../authContext';
import { CustomError } from './interfaces/interfaces';
import { UserFormProp } from './interfaces/interfaces';
import UserForm from './UserForm';

export default function Login() {

  const returnToFrontPage = useReturn();
  const { isAuthenticated, loading, setIsAuthenticated } = useAuth();

  const [formData, setFormData] = useState<UserFormProp>({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState<string>("");
  const resetMessage = () => {
    setMessage("");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if(!process.env.REACT_APP_LOGIN_URI) {
          return new Error("API URI not defined");
        }
          const response = await axios.post(
            process.env.REACT_APP_LOGIN_URI,
            formData,
            { withCredentials: true }
          );
          if (response.status === 201) {
              setIsAuthenticated(true);
              sessionStorage.setItem('isAuthenticated', 'true');
              setMessage(response.data.message)
              returnToFrontPage();
          }
      } catch (error) {
        const err = error as CustomError;
        setMessage("Error: " + err.response.data.message);
      }
  };

  return (
    <UserForm title="Log in" handleSubmit={handleSubmit} formData={formData} handleChange={handleChange} message={message} resetMessage={resetMessage} />
  );
};