import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function Error() {
  return (
    <div className="formWrapper">
      <h1 className="customTitle">404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/"><Button>Return to homepage</Button></Link>
    </div>
  );
};