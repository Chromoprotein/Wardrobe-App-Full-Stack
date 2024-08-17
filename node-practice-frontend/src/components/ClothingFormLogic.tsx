import React from "react";
import { useState } from 'react';
import ClothingForm from './ClothingForm';
import useReturn from '../utils/useReturn';
// npm install --save-dev @types/uuid
import axios from "axios";
import { FormProp } from "./interfaces/interfaces";

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
        img: "",
        file: null,
        filename: "",
    }
    const [formState, setFormState] = useState<FormProp>(initialState as FormProp);
    const [isSuccess, setIsSuccess] = useState(false);
    const returnToFrontPage = useReturn();

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormState((prevState) => ({ ...formState, [name]: value }));
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setFormState((prevState) => ({ ...prevState, "file": files[0] }));
            setFormState((prevState) => ({ ...prevState, "filename": files[0].name }));
        }
    };

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
            returnToFrontPage();
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
      <>
        <ClothingForm 
            handleClothingSubmit={handleAdd} 
            newClothing={formState}
            handleClothesFormChange={handleFormChange} 
            isSuccess={isSuccess} 
            handleFileUpload={handleFileUpload}
            filename={formState.filename}
        />
      </>
    );

}