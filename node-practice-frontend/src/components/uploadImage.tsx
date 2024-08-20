import React, { useState } from "react";
import Button from "./Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import useReturn from "utils/useReturn";
import BackButton from "./BackButton";

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

    const isDisabled = !Object.values(formState).every(value => value);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            console.log(response.data);
            returnToFrontPage();
        } catch (error) {
            console.error(error);
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

            <Button actionType="submit" isDisabled={isDisabled}>Submit</Button>
            <BackButton/>
        </form>

    );

}