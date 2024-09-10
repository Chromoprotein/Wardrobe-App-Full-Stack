import React from "react";
import { useState, useEffect } from "react";
import ClothingFilters from "./ClothingFilters";
import ClothingCard from "./ClothingCard";
import { outfitsRandomizer } from "../utils/outfitsRandomizer";
import BackButton from "./BackButton";
import Button from "./Button";
import Message from "./Message";
import { useFilterContext } from "../contexts/FilterContext";
import Spinner from "./Spinner";
import useWardrobe from "utils/useWardrobe";
import { OutfitsRandomizerReturnType } from "../utils/outfitsRandomizer";
import Logo from "./Logo";
import axios from "axios";
import { CustomError } from "./interfaces/interfaces";

export default function GenerateOutfits() {

    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const { loadingClothes, message, setMessage, clothes, getClothes } = useWardrobe();

    // Get the clothes of the wardrobe from custom hook
    useEffect(() => {
        getClothes();
    }, [getClothes]);

    // Filter function for filtering clothes
    const { filters, filteredClothes } = useFilterContext();
    // Apply the filter on clothes
    const clothesForOutfitGeneration = filteredClothes(clothes ?? []); // empty array fallback

    // State for the randomly generated outfit and for the error message
    // values: randomOutfit, errorMessage
    const [outfit, setOutfit] = useState<null | OutfitsRandomizerReturnType>(null);

    // When the clothes for outfit generation have been fetched, generate an outfit automatocally. !outfit ensures only one is generated at a time
    useEffect(() => {
        if (clothesForOutfitGeneration.length > 0 && !outfit) {
            const newOutfit = outfitsRandomizer(clothesForOutfitGeneration);
            setOutfit(newOutfit);
        }
    }, [clothesForOutfitGeneration, outfit]);

    if (loadingClothes ) return <Spinner />;

    // Generate random outfit by button press
    const handleGenerateOutfit = () => {
        setIsSuccess(false);
        setIsDisabled(false);
        setMessage("");
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

    const saveOutfit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (outfit && outfit.randomOutfit.length > 0) {
            const clothes = outfit.randomOutfit.map(piece => piece._id);
            setIsDisabled(true);

            const outfitData = {
                season: filters.season,
                formality: filters.formality,
                color: filters.color,
                clothes: clothes
            }

            try {
                const addOutfitUri = process.env.REACT_APP_ADD_OUTFIT_URI;

                if (!addOutfitUri) {
                    throw new Error("URI is not defined");
                }

                const response = await axios.post(addOutfitUri, { outfitData }, {
                    withCredentials: true,
                });
                console.log(response.data);
                setIsSuccess(true);
                setMessage(response.data.message);

            } catch (error) {
                const err = error as CustomError;
                const errorMessage = err.response?.data?.message || "An unknown error occurred"; 
                setMessage("Error: " + errorMessage);
                setIsDisabled(false);
            }

        } else {
            setMessage("Error: Outfit or pieces are missing");
        }

    }

    return (
        <div className="mainPageWrapper">
            <div className="navbarWrapper">

                <Logo/>
                <ClothingFilters />

                <Button children="Generate Another Outfit" eventHandler={handleGenerateOutfit} />

                {/*If an outfit has been generated, show the save button*/}
                {outfit && 
                    <Button isSuccess={isSuccess} eventHandler={saveOutfit} isDisabled={isDisabled}>Save Outfit</Button>
                }

                <BackButton />
            </div>

            <div className="mainContentWrapper">
                <div className="clothingCardContainer">
                    {mapOutfit && mapOutfit}
                </div>
                {message && <Message>{message}</Message>}
                {outfit && outfit.errorMessage.length > 0 && <Message>{outfit.errorMessage}</Message>}
            </div>
        </div>
    );
}