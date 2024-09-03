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

export default function ClothingEditLogic() {

  // Get the URL id when editing clothes
  const { id } = useParams();
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

  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormProp>(initialState as FormProp);
  const [loading, setLoading] = useState(true);
  const [hasUpdates, setHasUpdates] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState(false);
  const [message, setMessage] = useState<string>("");

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
            brand: newData.brand,
            color: newData.color,
            size: newData.size,
            season: newData.season,
            cost: newData.cost,
            formality: newData.formality,
            worn_count: newData.worn_count,
        })

      } catch (error) {
        const err = error as CustomError;
        setMessage("Error: " + err.response.data.message);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }
    getItemById();
    
  }, [setFormState, id, message])

  if (loading) return <Spinner />;
  
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormState((prevState) => ({ ...formState, [name]: value }));

        if(!hasUpdates) {
          setHasUpdates(true);
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();

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
        }
      } else {
        navigate(`/uploadImage/${id}`);
      }
    };

    const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        
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
        />

        <div className="mainContentWrapper">
            {id && <Button children="Delete" eventHandler={handleDelete} actionType="delete" isSuccess={isSuccessDelete} />}
        </div>
      </>
    );

}