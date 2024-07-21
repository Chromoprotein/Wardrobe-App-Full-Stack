import React from "react";
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Button from './Button';
import ClothingForm from './ClothingForm';
import useReturn from '../utils/useReturn';
// npm install --save-dev @types/uuid
import { useClothingContext } from '../contexts/ClothingContext';
import { usePaginationContext } from '../contexts/PaginationContext';
import { ClothingProp } from './interfaces/interfaces';
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
        }
    const [formState, setFormState] = useState<FormProp>(initialState as FormProp);
    const [isSuccess, setIsSuccess] = useState(false);
    const returnToFrontPage = useReturn();

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormState((prevState) => ({ ...formState, [name]: value }));
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in formState) {
            if (formState.hasOwnProperty(key)) {
                formData.append(key, formState[key as keyof FormProp]);
            }
        }

        try {
            const addUri = process.env.REACT_APP_ADD_URI;

            if (!addUri) {
                throw new Error("URI is not defined");
            }
            const response = await axios.post(addUri, formData, {
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
        />
      </>
    );

}