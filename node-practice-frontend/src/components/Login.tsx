import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { InputField } from './FormComponents';
import Button from './Button';
import useReturn from '../utils/useReturn';
import Message from './Message';
import { useAuth } from '../authContext';
import { CustomError } from './interfaces/interfaces';

export default function Login() {

  const returnToFrontPage = useReturn();
  const { isAuthenticated, loading, setIsAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string>("");

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
              returnToFrontPage();
          }
      } catch (error) {
        const err = error as CustomError;
        setError("Error: " + err.response.data.message);
      }
  };

  return (
    <form onSubmit={handleSubmit} className="formWrapper">

        <h1 className="customTitle">Log in</h1>

        <InputField name="email" menuState={formData.email} type="text" placeholder="Email" eventHandler={handleChange} />

        <InputField name="password" menuState={formData.password} type="password" placeholder="Password" eventHandler={handleChange} />

        <Button actionType="submit">Log in</Button>

        {error && 
        <Message onClose={() => setError("")}>{error}</Message>}

    </form>
  );
};