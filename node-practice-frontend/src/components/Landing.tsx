import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

export default function Landing() {

    return (
        <>
            <Link to={`/register`}>
                <Button children="Register" />
            </Link>
            <Link to={`/login`}>
                <Button children="Log in" />
            </Link>
        </>
    );

}