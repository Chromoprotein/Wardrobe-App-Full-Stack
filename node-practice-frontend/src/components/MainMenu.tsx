import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Logo from "./Logo";
import ClothingFilters from "./ClothingFilters";

export default function MainMenu() {
    return (
      <div className="navbarWrapper">
        <Logo/>

        <h2 className="customLabel">WARDROBE</h2>
        <Link to={`/generate`}>
            <Button children="Outfit Maker" />
        </Link>

        <Link to={`/outfits`}>
            <Button children="Saved Outfits" />
        </Link>
        <Link to={`/submit`}>
            <Button children="Add Clothes" />
        </Link>

        <ClothingFilters />

        <h2 className="customLabel">ACCOUNT</h2>
        <Link to={`/logout`}>
            <Button children="Log out" />
        </Link>
      </div>
    );
};