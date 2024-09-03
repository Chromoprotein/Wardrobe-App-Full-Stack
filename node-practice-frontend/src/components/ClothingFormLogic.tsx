import React from "react";
import { useState } from 'react';
import ClothingForm from './ClothingForm';
import { useNavigate } from "react-router-dom";
// npm install --save-dev @types/uuid
import axios from "axios";
import { FormProp } from "./interfaces/interfaces";
import { navigateWithTimeout } from "utils/navigateWithTimeout";
import { CustomError } from "./interfaces/interfaces";

export default function ClothingFormLogic() {

    // Populate the form with a clothing piece based on the URL id or start with an empty form
    const initialState = {
        category: "",
        subcategory: "",
        brand: "",
        color: "",
        size: "",
        season: "",
        cost: "",
        formality: "",
        worn_count: "",
    }
    const [formState, setFormState] = useState<FormProp>(initialState as FormProp);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const [message, setMessage] = useState<string>("");

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormState((prevState) => ({ ...formState, [name]: value }));
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in formState) {
            const value = formState[key as keyof FormProp];
            if (value !== null) {  // Ensure the value is not null
                formData.append(key, value as string | Blob);
            }
        }

        try {
            const addUri = process.env.REACT_APP_ADD_URI;

            if (!addUri) {
                throw new Error("URI is not defined");
            }
            const response = await axios.post(addUri, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }, 
                withCredentials: true,
            });
            console.log(response.data);
            setIsSuccess(true);
            setMessage(response.data.message);
            navigateWithTimeout(navigate, `/uploadImage/${response.data.id}`);
        } catch (error) {
            const err = error as CustomError;
            setMessage("Error: " + err.response.data.message);
        }
    };
    
    return (
      <>
        <ClothingForm 
            handleClothingSubmit={handleAdd} 
            newClothing={formState}
            handleClothesFormChange={handleFormChange} 
            isSuccess={isSuccess} 
            message={message}
        />
      </>
    );

}