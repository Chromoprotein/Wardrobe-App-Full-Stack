import { ClothingProp } from "components/interfaces/interfaces";
import { clothingCategories } from "dummyData/subcategoryArray";

export type OutfitsRandomizerReturnType = {
  randomOutfit: ClothingProp[];
  errorMessage: string;
};

export const outfitsRandomizer = (wardrobe: ClothingProp[]): OutfitsRandomizerReturnType => {
    const categories = Object.keys(clothingCategories);

    const randomOutfit: ClothingProp[] = [];

    let errorMessages: string[] = [];

    let isDressSelected = false;

    // Helper function that filters the wardrobe down to a category and selects a random item from the category, returns the item or null
    const getRandomItemFromCategory = (wardrobe: ClothingProp[], category: string): ClothingProp | null => {
        const itemsInCategory = wardrobe.filter((item) => item.category === category);
        if (itemsInCategory.length === 0) return null;
        return itemsInCategory[Math.floor(Math.random() * itemsInCategory.length)];
    };

    // First, check for a dress or other one-piece
    const dressItems = wardrobe.filter((item) => item.category === 'onePieces');

    // 50% chance to select a dress
    if (dressItems.length > 0 && Math.random() > 0.5) {
        const randomDress = dressItems[Math.floor(Math.random() * dressItems.length)];
        randomOutfit.push(randomDress);
        isDressSelected = true;
    }

    // Filter categories
    const filteredCategories = categories.filter((category) => 
    !(isDressSelected && (category === 'bottom' || category === 'top')) && category !== 'onePieces');

    // Randomly select from remaining categories
    filteredCategories.forEach((category) => {
        const randomItem = getRandomItemFromCategory(wardrobe, category);
        if (!randomItem) {
            errorMessages.push(`No items available for the category "${category}".`);
        } else {
            randomOutfit.push(randomItem);
        }
    });

    return { randomOutfit, errorMessage: errorMessages.join(' ') || '' };

};
