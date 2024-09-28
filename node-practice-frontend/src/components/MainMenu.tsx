import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import Logo from "./Logo";
import ClothingFilters from "./ClothingFilters";
import { useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

export default function MainMenu() {

    const [menuIsVisible, setMenuIsVisible] = useState(false);

    const toggleMenuIsVisible = () => {
        setMenuIsVisible(!menuIsVisible);
    }

    return (
        <>
            <div className="navbarMobileMenu">
                <Button eventHandler={toggleMenuIsVisible}>
                    Menu 
                    <span className={`arrow ${menuIsVisible ? "arrowUp" : ""}`}><IoIosArrowUp /></span>
                </Button>
            </div>

            <div className={`navbarWrapper ${menuIsVisible ? "active" : ""}`}>
                <Logo/>

                <h2 className="customLabel centeredText">WARDROBE</h2>
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

                <h2 className="customLabel centeredText">ACCOUNT</h2>
                <Link to={`/logout`}>
                    <Button children="Log out" />
                </Link>
            </div>
        </>
    );
};