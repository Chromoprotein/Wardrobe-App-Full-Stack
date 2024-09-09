import { useState, useCallback } from "react";
import { useClothingContext } from "contexts/ClothingContext";
import axiosInstance from "./axiosInstance";
import { CustomError } from "components/interfaces/interfaces";
import { ClothingProp } from "components/interfaces/interfaces";

interface UseWardrobeReturn {
    loadingClothes: boolean;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    clothes: ClothingProp[] | undefined;
    getClothes: () => Promise<void>;
}

export default function useWardrobe(): UseWardrobeReturn {

    const [loadingClothes, setLoadingClothes] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");

    // clothes = original clothing array
    const { clothes, setClothes } = useClothingContext();

    const getClothes = useCallback(async () => {
        try {
            const clothingUri = process.env.REACT_APP_CLOTHING_URI;

            if (!clothingUri) {
            throw new Error("API URI is not defined");
            }
            const res = await axiosInstance.get(clothingUri);
            setClothes(res.data.clothes);
            console.log(res.data.clothes)
        } catch (error) {
            const err = error as CustomError;
            const errorMessage = err.response?.data?.message || "An unknown error occurred"; 
            setMessage("Error: " + errorMessage);
        } finally {
            setLoadingClothes(false); // Set loading to false after fetching data
        }
    }, [setClothes]);

    return {loadingClothes, message, setMessage, clothes, getClothes};

};