import React from "react";
import { useState, useEffect } from "react";
import ClothingCard from "./ClothingCard";
import PaginationControls from "./PaginationControls";
import Message from "./Message";
import { usePaginationContext } from "../contexts/PaginationContext";
import { ClothingProp } from "./interfaces/interfaces";
import { CustomError } from "./interfaces/interfaces";
import axios from "axios";
import { OutfitProp } from "./interfaces/interfaces";
import { useFilterContext } from "contexts/FilterContext";
import MainMenu from "./MainMenu";
import Spinner from "./Spinner";
import Button from "./Button";

export default function SavedOutfits() {

    //delete or wear message in outfit card
    const [outfitMessage, setOutfitMessage] = useState<{id: string, content: string}>({id: "", content: ""});
    //other messages on top of the page
    const [message, setMessage] = useState<string>("");

    const [isDisabled, setIsDisabled] = useState<string>(""); // id of disabled button

    const [savedOutfits, setSavedOutfits] = useState<OutfitProp[]>();

    const [loading, setLoading] = useState<boolean>(true);

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
            } finally {
                setLoading(false);
            }
        }
        getOutfits();
    }, [setSavedOutfits]);

    if(loading) {
        return <Spinner />
    }

    if (!savedOutfits) return <Message>No outfits saved</Message>

    type ButtonAction = (id: string) => void;

    const handleWear: ButtonAction = (id) => {
        
    }

    const handleDelete: ButtonAction = async (id) => {
        
        try {
            setIsDisabled(id);
            const deleteUri = `${process.env.REACT_APP_DELETE_OUTFIT_URI}/${id}`; // Include ID in URL

            if (!deleteUri) {
                throw new Error("URI is not defined");
            }
            const response = await axios.delete(deleteUri, { withCredentials: true });

            console.log(response.data);
            setOutfitMessage({id: id, content: response.data.message});
            window.location.reload();
        } catch (error) {
            setIsDisabled("");
            const err = error as CustomError;
            setOutfitMessage({id: id, content: "Error: " + err.response.data.message});
        }
        
    }

    const mappedOutfits: JSX.Element[] = filteredOutfits(savedOutfits)
    .map((outfit: OutfitProp) => (
            <div key={outfit._id} className="outfitContainer">
                <div className="clothingCardContainer">
                    {outfit.clothes.map((clothing: ClothingProp) => (
                        <div key={clothing._id}>
                            <ClothingCard clothingProp={clothing} />
                        </div>
                    ))}
                </div>
                <div className="clothingTextWrapper">
                    {outfit.formality ? outfit.formality : "any formality"} 
                    <span> &#8226; </span> 
                    {outfit.season ? outfit.season : "any season"}
                    <span> &#8226; </span> 
                    {outfit.color && outfit.color.length > 0 ? outfit.color.join(" ") : "random colors"}
                </div>
                <div className="outfitNav">
                    <Button 
                        eventHandler={() => handleWear(outfit._id)}
                        isDisabled={outfit._id === isDisabled}>
                            +1 Wear
                        </Button>
                    <Button 
                        eventHandler={() => handleDelete(outfit._id)} 
                        isDisabled={outfit._id === isDisabled}>
                            Delete
                    </Button>
                </div>
                {(outfitMessage.content.length > 0 && outfitMessage.id === outfit._id) && <Message>{outfitMessage.content}</Message>}
            </div>
        )
    );

    // Pagination
    const paginatedItems: JSX.Element[] = currentItems(mappedOutfits);

    return (
        <div className="mainPageWrapper">

        <MainMenu />

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