import React from "react";
import { useState } from 'react';
import ClothingForm from './ClothingForm';
import { useNavigate } from "react-router-dom";
// npm install --save-dev @types/uuid
import axios from "axios";
import { FormProp } from "./interfaces/interfaces";
import { navigateWithTimeout } from "utils/navigateWithTimeout";
import { CustomError } from "./interfaces/interfaces";
import { clothingCategories } from "dummyData/subcategoryArray";
import Button from "./Button";
import useReturn from "utils/useReturn";
import BackButton from "./BackButton";
import Message from "./Message";


export default function ClothingFormLogic() {

    // Populate the form with a clothing piece based on the URL id or start with an empty form
    const initialState = {
        category: "tops", // Default category
        subcategory: "",
        color: "",
        season: "",
        cost: "",
        formality: "",
        worn_count: "",
        name: "",
        brand: "",
        filename: "",
    }
    const mandatoryFields: Array<keyof FormProp> = ["category", "subcategory", "color", "season", "cost", "formality", "worn_count", "filename"];
    const [formState, setFormState] = useState<FormProp>(initialState as FormProp);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const returnToFrontPage = useReturn();

    const [message, setMessage] = useState<string>("");

    //Clothing categories
    const mainCategories = Object.keys(clothingCategories);
    const [subCategories, setSubCategories] = useState<string[]>(clothingCategories[formState.category]);

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const newState: FormProp = { ...formState, [name]: value };
        setFormState((prevState) => newState);

        //Update visible subcategories when main category changes
        if(name === "category") {
            setSubCategories(clothingCategories[value as keyof typeof clothingCategories] || []);
            setFormState((prevState) => ({ ...prevState, subcategory: "" })); // Reset subcategory when changing category
        }

        //Check if submit button should be enabled
        const isDisabledChange = (): boolean => {
            return !mandatoryFields.every((field) => newState[field]);
        };
        setIsDisabled(isDisabledChange);
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDisabled(true);
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
            returnToFrontPage();
        } catch (error) {
            const err = error as CustomError;
            const errorMessage = err.response?.data?.message || "An unknown error occurred"; 
            setMessage("Error: " + errorMessage);
            setIsDisabled(false);
        }
    };
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormState((prevState) => ({ ...prevState, "file": files[0] }));
            setFormState((prevState) => ({ ...prevState, "filename": files[0].name }));
        }
    };

    const handleButtonClick = () => {
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        (fileInput as HTMLInputElement).click();
      }
    };

    return (
      <>
        <ClothingForm 
            handleFileUpload={handleFileUpload}
            handleImageButtonClick={handleButtonClick}
            handleClothingSubmit={handleAdd} 
            newClothing={formState}
            handleClothesFormChange={handleFormChange} 
            isSuccess={isSuccess} 
            message={message}
            isDisabled={isDisabled}
            mainCategories={mainCategories}
            subCategories={subCategories}
        />
      </>
    );

}