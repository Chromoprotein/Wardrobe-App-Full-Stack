import React from "react";
import colors from "../dummyData/ColorsArray.ts";
import { formality } from "../dummyData/formalityArray.ts";
import { useFilterContext } from "../contexts/FilterContext";
import { seasons } from "../dummyData/seasonsArray.ts";
import { ColorPicker, SelectMenu } from "./FormComponents";
import Button from "./Button";

export default function ClothingFilters() {
    
    const { filters, handleFiltersChange, resetFilters, resetButtonState } = useFilterContext();

    return ( 
        <>

            <h2 className="customLabel">FILTERS</h2>
            <ColorPicker type="checkbox" menuState={filters.color} colorsArray={colors} eventHandler={handleFiltersChange} />

            <SelectMenu name="formality" menuState={filters.formality} inputArray={formality} eventHandler={handleFiltersChange}/>

            <SelectMenu name="season" menuState={filters.season} inputArray={seasons} eventHandler={handleFiltersChange}/>

            <Button isDisabled={resetButtonState} children="Reset Filters" eventHandler={resetFilters} />
            
        </>
    );
};