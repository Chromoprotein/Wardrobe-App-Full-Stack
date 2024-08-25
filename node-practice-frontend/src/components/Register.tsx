import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { InputField } from './FormComponents';
import Button from './Button';

export default function Register() {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formWrapper">

      <h1 className="customTitle">Register</h1>

      <InputField name="name" menuState={formData.name} type="text" placeholder="Username" eventHandler={handleChange} />

      <InputField name="email" menuState={formData.email} type="text" placeholder="Email" eventHandler={handleChange} />

      <InputField name="password" menuState={formData.password} type="password" placeholder="Password" eventHandler={handleChange} />

      <Button actionType="submit">Register</Button>
    </form>
  );
};