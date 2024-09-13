import React from "react";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ClothingForm from './ClothingForm';
import axios from "axios";
import { FormProp } from "./interfaces/interfaces";
import Button from "./Button";
import useReturn from "utils/useReturn";
import { useNavigate } from "react-router-dom";
import { navigateWithTimeout } from "utils/navigateWithTimeout";
import { CustomError } from "./interfaces/interfaces";
import Spinner from "./Spinner";
import { clothingCategories } from "dummyData/subcategoryArray";

export default function ClothingEditLogic() {

  // Get the URL id when editing clothes
  const { id } = useParams();
  const initialState = {
      category: "",
      subcategory: "",
      color: "",
      season: "",
      cost: "",
      formality: "",
      worn_count: "",
      name: "",
      brand: "",
  }
  const mandatoryFields: Array<keyof FormProp> = ["category", "subcategory", "color", "season", "cost", "formality", "worn_count"];

  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormProp>(initialState as FormProp);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasUpdates, setHasUpdates] = useState<boolean>(false);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  //Clothing categories
  const mainCategories = Object.keys(clothingCategories);
  const [subCategories, setSubCategories] = useState<string[]>(clothingCategories[formState.category]);

  // Return to front page
  const returnToFrontPage = useReturn();

  useEffect(() => {
    const getItemById = async () => {
      try {
        const clothingUri = `${process.env.REACT_APP_SINGLE_ITEM_URI}/${id}`;

        if (!clothingUri) {
          throw new Error("URI is not defined");
        }

        const res = await axios.get(clothingUri, { 
            withCredentials: true
        });

        const newData = res.data.clothing;
        setFormState({
            category: newData.category,
            subcategory: newData.subcategory,
            color: newData.color,
            season: newData.season,
            cost: newData.cost,
            formality: newData.formality,
            worn_count: newData.worn_count,
            name: newData.name,
            brand: newData.brand,
        })
        setSubCategories(clothingCategories[newData.category as keyof typeof clothingCategories] || []);

      } catch (error) {
        const err = error as CustomError;
        const errorMessage = err.response?.data?.message || "An unknown error occurred"; 
        setMessage("Error: " + errorMessage);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }
    getItemById();
    
  }, [setFormState, id, message])

  if (loading) return <Spinner />;
  
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      const newState: FormProp = { ...formState, [name]: value };
      setFormState((prevState) => newState);

      //Update visible subcategories when main category changes
      if(name === "category") {
          setSubCategories(clothingCategories[value as keyof typeof clothingCategories] || []);
          setFormState((prevState) => ({ ...prevState, subcategory: "" })); // Reset subcategory when changing category
      }

      if(!hasUpdates) {
        setHasUpdates(true);
      }

      //Check if submit button should be enabled
      const isDisabledChange = (): boolean => {
        return !mandatoryFields.every((field) => newState[field]);
      };
      setIsDisabled(isDisabledChange);
    }

    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsDisabled(true);

      // If there are updates, send them to the server, else go to the next part of the form
      if(hasUpdates) {
        const formData = new FormData();
        for (const key in formState) {
            const value = formState[key as keyof FormProp];
            if (value !== null) {  // Ensure the value is not null
                formData.append(key, value as string | Blob);
            }
        }

        try {
            const addUri = `${process.env.REACT_APP_UPDATE_ITEM_URI}/${id}`;

            if (!addUri) {
                throw new Error("URI is not defined");
            }

            const response = await axios.put(addUri, formState, { withCredentials: true });

            console.log(response.data);
            setIsSuccess(true);
            setMessage(response.data.message);
            navigateWithTimeout(navigate, `/uploadImage/${response.data.id}`);
        } catch (error) {
            const err = error as CustomError;
            setMessage("Error: " + err.response.data.message);
            setIsDisabled(false);
        }
      } else {
        navigate(`/uploadImage/${id}`);
      }
    };

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsDisabled(true);
        
        try {

            const deleteUri = `${process.env.REACT_APP_DELETE_URI}/${id}`; // Include ID in URL

            if (!deleteUri) {
                throw new Error("URI is not defined");
            }
            const response = await axios.delete(deleteUri, { withCredentials: true });

            console.log(response.data);
            setIsSuccessDelete(true);
            setMessage(response.data.message);
            returnToFrontPage();
        } catch (error) {
            setIsSuccess(false);
            const err = error as CustomError;
            setMessage("Error: " + err.response.data.message);
            setIsDisabled(false);
        }
        
    };
    
    return (
      <>
        <ClothingForm 
            handleClothingSubmit={handleUpdate} 
            newClothing={formState}
            handleClothesFormChange={handleFormChange} 
            isSuccess={isSuccess} 
            message={message}
            isDisabled={isDisabled}
            mainCategories={mainCategories}
            subCategories={subCategories}
        />

        <div className="mainContentWrapper">
            {id && <Button children="Delete" eventHandler={handleDelete} actionType="delete" isSuccess={isSuccessDelete} />}
        </div>
      </>
    );

}