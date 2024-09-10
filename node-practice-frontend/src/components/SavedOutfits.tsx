import React from "react";
import { useState, useEffect } from "react";
import BackButton from "./BackButton";
import ClothingCard from "./ClothingCard";
import PaginationControls from "./PaginationControls";
import Message from "./Message";
import { usePaginationContext } from "../contexts/PaginationContext";
import { ClothingProp } from "./interfaces/interfaces";
import { CustomError } from "./interfaces/interfaces";
import axios from "axios";
import { OutfitProp } from "./interfaces/interfaces";
import Logo from "./Logo";
import ClothingFilters from "./ClothingFilters";
import { useFilterContext } from "contexts/FilterContext";

export default function SavedOutfits() {

    const [message, setMessage] = useState<string>("");

    const [savedOutfits, setSavedOutfits] = useState<OutfitProp[]>();

    const { currentItems } = usePaginationContext();
    const { filteredOutfits } = useFilterContext();

    useEffect(() => {
        const getOutfits = async () => {
            try {
                const outfitsUri = process.env.REACT_APP_GET_OUTFITS_URI;

                if(!outfitsUri) {
                    throw new Error("API URI is not defined");
                }

                const res = await axios.get(outfitsUri, { withCredentials: true });
                setSavedOutfits(res.data.outfits);
                
                console.log(res.data.outfits)
            } catch (error) {
                const err = error as CustomError;
                const errorMessage = err.response?.data?.message || "An unknown error occurred"; 
                setMessage("Error: " + errorMessage);
            }
        }
        getOutfits();
    }, [setSavedOutfits]);

    if (!savedOutfits) return <Message>No outfits saved</Message>

    const mappedOutfits: JSX.Element[] = filteredOutfits(savedOutfits)
    .map((outfit: OutfitProp, index) => (
            <div key={outfit._id} className="clothingCardContainer outfitContainer">
                <div>Outfit {index+1}</div>
                {outfit.clothes.map((clothing: ClothingProp) => (
                    <div key={clothing._id}>
                        <ClothingCard clothingProp={clothing} />
                    </div>
                ))}
            </div>
        )
    );

    // Pagination
    const paginatedItems: JSX.Element[] = currentItems(mappedOutfits);

    return (
        <div className="mainPageWrapper">

        <div className="navbarWrapper">
            <Logo/>
            {/*Menu where you can choose filters for clothes*/}
            <ClothingFilters />
            <BackButton />
        </div>

        <div className="mainContentWrapper">
            {paginatedItems.length > 0 ? (
            <>
                {/*The currently displayed clothes*/}
                <div className="clothingCardContainer">
                    {paginatedItems}
                </div>

                {/*Next, previous, and page number buttons. Takes an array of filtered clothes*/}
                <PaginationControls clothes={mappedOutfits} />
            </>
            ) : (
            <Message>No outfits saved</Message>
            )}
            {message && <Message>{message}</Message>}
        </div>

        </div>
    );
}