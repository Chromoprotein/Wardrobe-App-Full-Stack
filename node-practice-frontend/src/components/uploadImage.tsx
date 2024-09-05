import React, { useState } from "react";
import Button from "./Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import useReturn from "utils/useReturn";
import BackButton from "./BackButton";
import { CustomError } from "./interfaces/interfaces";
import Message from "./Message";

interface FormProp {
    file: null | File;
    filename: string;
}

export default function UploadImage() {

    const { id } = useParams();

    const returnToFrontPage = useReturn();

    const initialState = {
        file: null,
        filename: "",
    }
    const [formState, setFormState] = useState<FormProp>(initialState as FormProp);

    const [message, setMessage] = useState<string>("");
    const [isSuccess, setisSuccess] = useState<boolean>(false);

    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFormState((prevState) => ({ ...prevState, "file": files[0] }));
            setFormState((prevState) => ({ ...prevState, "filename": files[0].name }));
            setIsDisabled(false);
        }
    };

    const handleButtonClick = () => {
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        (fileInput as HTMLInputElement).click();
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            const imageUri = `${process.env.REACT_APP_IMAGE_URI}/${id}`;

            if (!imageUri) {
                throw new Error("URI is not defined");
            }

            const response = await axios.put(imageUri, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }, 
                withCredentials: true,
            });
            setisSuccess(true);
            console.log(response.data);
            setMessage(response.data.message);
            returnToFrontPage();

        } catch (error) {
            const err = error as CustomError;
            setMessage("Error: " + err.response.data.message);
            setIsDisabled(false);
        }
    };

    return (

        <form onSubmit={handleSubmit} className="formWrapper">
            <input
            type="file"
            id="file-upload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            />

            <Button eventHandler={handleButtonClick}>Upload Image</Button>
            {formState.filename &&
                <label className='customLabel' htmlFor='customFile'>
                    {formState.filename}
                </label>
            }

            <Button actionType="submit" isDisabled={isDisabled} isSuccess={isSuccess}>Submit</Button>

            {message && <Message>{message}</Message>}

            <BackButton/>
        </form>

    );

}