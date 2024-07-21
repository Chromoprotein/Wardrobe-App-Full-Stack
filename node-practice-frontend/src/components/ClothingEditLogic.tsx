import React from "react";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ClothingForm from './ClothingForm';
import axios from "axios";
import { FormProp } from "./interfaces/interfaces";
import Button from "./Button";
import useReturn from "utils/useReturn";

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
        img: "",
    }

    const [formState, setFormState] = useState<FormProp>(initialState as FormProp);
    const [loading, setLoading] = useState(true);

    const [isSuccess, setIsSuccess] = useState(false);
    const [isSuccessDelete, setIsSuccessDelete] = useState(false);
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
            img: newData.img,
        })

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }
    getItemById();
    
  }, [setFormState, id])

  if (loading) return <p>Loading...</p>;
  
    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormState((prevState) => ({ ...formState, [name]: value }));
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in formState) {
            if (formState.hasOwnProperty(key)) {
                formData.append(key, formState[key as keyof FormProp]);
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
            returnToFrontPage();
        } catch (error) {
            console.error(error);
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
            returnToFrontPage();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
        
    };
    
    return (
      <>
        <ClothingForm 
            handleClothingSubmit={handleUpdate} 
            newClothing={formState}
            handleClothesFormChange={handleFormChange} 
            isSuccess={isSuccess} 
        />

        <div className="mainContentWrapper">
            {id && <Button children="Delete" eventHandler={handleDelete} actionType="delete" isSuccess={isSuccessDelete} />}
        </div>
      </>
    );

}