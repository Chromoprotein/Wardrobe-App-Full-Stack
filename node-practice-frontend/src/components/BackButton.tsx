import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function BackButton() {
    return (
        <Link to={`/`}>
            <Button>Home</Button>
        </Link>
    );
};