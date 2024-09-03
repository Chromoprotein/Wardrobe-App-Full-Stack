import React from "react";
import { InputField } from "./FormComponents";
import Message from "./Message";
import Button from "./Button";
import BackButton from "./BackButton";
import { UserFormProp } from "./interfaces/interfaces";

interface UserFormProps {
    title: string;
    handleSubmit: (e: React.FormEvent) => void;
    formData: UserFormProp;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    message?: string;
    resetMessage: () => void;
}

export default function UserForm({title, handleSubmit, formData, handleChange, message, resetMessage}: UserFormProps) {

    const isDisabled = !Object.values(formData).every(value => value);

    return (
        <div className="formWrapper">
            <form onSubmit={handleSubmit}>

                <h1 className="customTitle">{title}</h1>

                {typeof formData.name === "string" && <InputField name="name" menuState={formData.name} type="text" placeholder="Username" eventHandler={handleChange} />}

                <InputField name="email" menuState={formData.email} type="text" placeholder="Email" eventHandler={handleChange} />

                <InputField name="password" menuState={formData.password} type="password" placeholder="Password" eventHandler={handleChange} />

                <Button actionType="submit" isDisabled={isDisabled}>{title}</Button>

                {message && 
                <Message onClose={resetMessage}>{message}</Message>}
            </form>
            <BackButton/>
        </div>
    );
}