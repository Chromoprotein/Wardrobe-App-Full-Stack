import React from "react";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ClothingForm from './ClothingForm';
import axios from "axios";
import { FormProp, ImageProp } from "./interfaces/interfaces";
import Button from "./Button";
import useReturn from "utils/useReturn";
import { CustomError } from "./interfaces/interfaces";
import Spinner from "./Spinner";
import { clothingCategories } from "dummyData/subcategoryArray";

export default function ClothingFormLogic() {

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
      filename: "",
      file: null,
  }
  const mandatoryFields: Array<keyof FormProp> = ["category", "subcategory", "color", "season", "cost", "formality", "worn_count"];

  const initialImageState = {
    imageBase64: "",
    contentType: "",
  }

  // Image states
  const [formState, setFormState] = useState<FormProp>(initialState as FormProp);
  const [oldImageState, setOldImageState] = useState<ImageProp>(initialImageState as ImageProp);
  const [previewImage, setPreviewImage] = useState<string>("");

  // Utility states
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
    if(id) {
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
              brand: newData.brand
          })
          setSubCategories(clothingCategories[newData.category as keyof typeof clothingCategories] || []);

          setOldImageState({
            imageBase64: newData.imageBase64,
            contentType: newData.contentType,
          })

        } catch (error) {
          const err = error as CustomError;
          const errorMessage = err.response?.data?.message || "An unknown error occurred"; 
          setMessage("Error: " + errorMessage);
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      }
      getItemById();
    } else {
        setLoading(false);
    }
    
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

    const formData = new FormData();
    for (const key in formState) {
        const value = formState[key as keyof FormProp];
        if (value !== null) {  // Ensure the value is not null
            formData.append(key, value as string | Blob);
        }
    }

    try {
      // UPDATE
      if(id) {
        const addUri = `${process.env.REACT_APP_UPDATE_ITEM_URI}/${id}`;

        if (!addUri) {
            throw new Error("URI is not defined");
        }

        const response = await axios.put(addUri, formState, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }, 
            withCredentials: true,
        });
        setMessage(response.data.message);
      // ADD NEW
      } else {
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
          setMessage(response.data.message);
      }
      setIsSuccess(true);
      returnToFrontPage();
    } catch (error) {
        const err = error as CustomError;
        setMessage("Error: " + err.response.data.message);
        setIsDisabled(false);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
          setFormState((prevState) => ({ ...prevState, "file": files[0] }));
          setFormState((prevState) => ({ ...prevState, "filename": files[0].name }));

          setPreviewImage(URL.createObjectURL(files[0]));
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
          handleClothingSubmit={handleUpdate} 
          newClothing={formState}
          handleClothesFormChange={handleFormChange} 
          isSuccess={isSuccess} 
          message={message}
          isDisabled={isDisabled}
          mainCategories={mainCategories}
          subCategories={subCategories}
          oldImage={oldImageState}
          previewImage={previewImage}
      />

      <div className="mainContentWrapper">
          {id && <Button children="Delete" eventHandler={handleDelete} actionType="delete" isSuccess={isSuccessDelete} />}
      </div>
    </>
  );

}