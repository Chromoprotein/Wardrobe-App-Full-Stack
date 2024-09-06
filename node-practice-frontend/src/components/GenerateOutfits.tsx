import React from "react";
import { useState } from "react";
import ClothingFilters from "./ClothingFilters";
import ClothingCard from "./ClothingCard";
import { outfitsRandomizer } from "../utils/outfitsRandomizer";
import BackButton from "./BackButton";
import Button from "./Button";
import Message from "./Message";
import { useOutfitContext } from "../contexts/OutfitsContext";
import { useClothingContext } from "../contexts/ClothingContext";
import { useFilterContext } from "../contexts/FilterContext";

export default function GenerateOutfits() {

    // State for randomly generated outfits saved by the user
    const { savedOutfits, setSavedOutfits } = useOutfitContext();
    const [isSuccess, setIsSuccess] = useState(false);

    // State for the all clothing pieces array
    const { clothes } = useClothingContext();

    // Filter function for filtering clothes
    const { filteredClothes } = useFilterContext();
    // Apply the filter on clothes
    const clothesForOutfitGeneration = filteredClothes(clothes ?? []); // empty array fallback

    // State for the randomly generated outfit and for the error message
    // values: randomOutfit, errorMessage
    const [outfit, setOutfit] = useState(() => 
    clothesForOutfitGeneration.length > 0 
        ? outfitsRandomizer(clothesForOutfitGeneration) 
        : null // or a fallback value, e.g., an empty outfit
    );

    // Generate random outfit
    const handleGenerateOutfit = () => {
        setIsSuccess(false);
        const { randomOutfit, errorMessage } = outfitsRandomizer(clothesForOutfitGeneration);

        setOutfit(prevOutfit => ({
            ...prevOutfit,
            errorMessage: errorMessage,
            randomOutfit: randomOutfit,
        }))
    };

    // Display the generated outfit
    const mapOutfit = outfit && outfit.randomOutfit
        .map((piece) => (
        <div key={piece._id}>
            <ClothingCard clothingProp={piece} />
        </div>
        )
    );

    const saveOutfit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(outfit) {
            const ids = outfit.randomOutfit.map(piece => piece._id);
            if(savedOutfits) {
                setSavedOutfits([...savedOutfits, ids]);
            } else {
                setSavedOutfits([ids]);
            }
            setIsSuccess(true);
            console.log(ids)
        }

    }

    return (
        <div className="mainPageWrapper">
            <div className="navbarWrapper">

                <ClothingFilters />

                <Button children="Re-generate Outfit" eventHandler={handleGenerateOutfit} />

                {/*If an outfit has been generated, show the save button*/}
                {outfit && outfit.errorMessage.length === 0 && 
                    <Button children="Save Outfit" isSuccess={isSuccess} eventHandler={saveOutfit} />
                }

                <BackButton />
            </div>

            <div className="mainContentWrapper">
                <div className="clothingCardContainer">
                    {mapOutfit && mapOutfit}
                    {outfit && outfit.errorMessage.length > 0 && <Message children={outfit.errorMessage} />}
                </div>
            </div>
        </div>
    );
}