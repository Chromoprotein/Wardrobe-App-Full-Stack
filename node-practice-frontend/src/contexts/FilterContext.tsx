import React, { createContext, useState, useContext, ReactNode } from "react";
import { usePaginationContext } from "./PaginationContext";
import { ClothingProp } from "../components/interfaces/interfaces";
import { OutfitProp } from "../components/interfaces/interfaces";

// Types for our filters and context
interface FilterState {
  formality: string;
  color: string[];
  season: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  handleFiltersChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  resetFilters: () => void;
  resetButtonState: boolean;
  setResetButtonState: (resetButtonState: boolean) => void;
  filteredClothes: (clothes: ClothingProp[]) => ClothingProp[];
  filteredOutfits: (clothes: OutfitProp[]) => OutfitProp[];
}

interface FilterContextProviderProps {
  children: ReactNode;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterContextProvider = ({ children }: FilterContextProviderProps) => {

  const [filters, setFilters] = useState<FilterState>({
    formality: "",
    color: [],
    season: "",
  });

  const [resetButtonState, setResetButtonState] = useState<boolean>(true);

  const { setCurrentPage } = usePaginationContext();

    // Event handler for filters
    const handleFiltersChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        let newFilters: FilterState;

        if (event.target instanceof HTMLInputElement && event.target.type === "checkbox") {
            const { checked } = event.target;
            let updatedColors;
            if (checked) {
                updatedColors = [...filters.color, value];
            } else {
                updatedColors = filters.color.filter(color => color !== value);
            }
            newFilters = { ...filters, [name]: updatedColors };
        } else {
            newFilters = { ...filters, [name]: value };
        }

        setFilters(newFilters);

        // empty filters = reset button disabled: true
        // filters are in use = reset button disabled: false
        const areAllFiltersEmpty = (filtersToCheck: FilterState) => {
            return Object.values(filtersToCheck).every(value => 
                (Array.isArray(value) ? value.length === 0 : value === "")
            );
        };

        setResetButtonState(areAllFiltersEmpty(newFilters));

        // filter change returns to page 1
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({ formality: "", color: [], season: "" });
        setResetButtonState(true);

        // filter change returns to page 1
        setCurrentPage(1);
    };

    // apply the filters to a clothing array
    const filteredClothes = (clothes: ClothingProp[]) => {
        return clothes.filter(
            (piece) =>
            (filters.formality ? piece.formality === filters.formality : true) &&
            (filters.color.length ? filters.color.includes(piece.color) : true) &&
            (filters.season ? piece.season === filters.season : true)
        );
    };

    const filteredOutfits = (outfits: OutfitProp[]) => {
        return outfits.filter(
            (outfit) =>
            (filters.formality ? outfit.formality === filters.formality : true) &&
            (filters.color.length ? filters.color.every(color => outfit.color &&outfit.color.includes(color)) : true) &&
            (filters.season ? outfit.season === filters.season : true)
        );
    };
    
    return (
        <FilterContext.Provider value={{ filters, setFilters, handleFiltersChange, resetFilters, resetButtonState, setResetButtonState, filteredClothes, filteredOutfits }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterContextProvider');
  }
  return context;
}