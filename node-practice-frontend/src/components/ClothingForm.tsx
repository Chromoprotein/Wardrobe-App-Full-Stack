import React from "react";
import BackButton from "./BackButton";
import colors from "../dummyData/ColorsArray";
import { formality } from "../dummyData/formalityArray";
import category from "../dummyData/categoryArray";
import subcategory from "dummyData/subcategoryArray";
import { SelectMenu, InputField, ColorPicker } from "./FormComponents";
import { seasons } from "../dummyData/seasonsArray";
import { sizes } from "../dummyData/sizesArray";
import Button from "./Button";
import { FormProp } from "./interfaces/interfaces";

interface FormProps {
  handleClothingSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  newClothing: FormProp;
  handleClothesFormChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSuccess?: boolean;
  handleFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filename?: string;
}

export default function ClothingForm({ handleClothingSubmit, newClothing, handleClothesFormChange, isSuccess, handleFileUpload, filename }: FormProps) {

    // Submit button
    const isDisabled = !Object.values(newClothing).every(value => value);

    return (
      <div className="formWrapper">
        <form onSubmit={handleClothingSubmit}>

          {handleFileUpload &&
            <div className='custom-file mb-4'>
              <input type='file' className='custom-file-input' id='customFile' onChange={handleFileUpload} />
              <label className='custom-file-label' htmlFor='customFile'>
                {filename}
              </label>
            </div>
          }

          <SelectMenu name="category" menuState={newClothing.category} inputArray={category} eventHandler={handleClothesFormChange}/>

          <SelectMenu name="subcategory" menuState={newClothing.subcategory} inputArray={subcategory} eventHandler={handleClothesFormChange}/>

          <SelectMenu name="formality" menuState={newClothing.formality} inputArray={formality} eventHandler={handleClothesFormChange}/>

          <SelectMenu name="season" menuState={newClothing.season} inputArray={seasons} eventHandler={handleClothesFormChange}/>

          <SelectMenu name="size" menuState={newClothing.size} inputArray={sizes} eventHandler={handleClothesFormChange}/>

          <ColorPicker type="radio" menuState={newClothing.color} colorsArray={colors} eventHandler={handleClothesFormChange} />

          <InputField name="brand" menuState={newClothing.brand} eventHandler={handleClothesFormChange} type="text" placeholder="Brand A"/>

          <InputField name="cost" menuState={newClothing.cost} eventHandler={handleClothesFormChange} type="number" placeholder="10"/>

          <InputField name="worn_count" menuState={newClothing.worn_count} eventHandler={handleClothesFormChange} type="number" placeholder="10"/>

          <Button isDisabled={isDisabled} children="Submit" actionType="submit" isSuccess={isSuccess} />
    
        </form>

          <BackButton/>

      </div>         
    );
}