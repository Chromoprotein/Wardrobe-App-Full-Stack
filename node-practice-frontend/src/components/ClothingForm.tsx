import React from "react";
import BackButton from "./BackButton";
import colors from "../dummyData/ColorsArray";
import { formality } from "../dummyData/formalityArray";
import { SelectMenu, InputField, ColorPicker } from "./FormComponents";
import { seasons } from "../dummyData/seasonsArray";
import Button from "./Button";
import { FormProp, ImageProp } from "./interfaces/interfaces";
import Message from "./Message";

interface FormProps {
  handleClothingSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  newClothing: FormProp;
  handleClothesFormChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isSuccess?: boolean;
  message: string;
  isDisabled: boolean;
  mainCategories: string[];
  subCategories: string[];
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageButtonClick: () => void;
  oldImage: ImageProp;
  previewImage: string;
}

export default function ClothingForm({ handleClothingSubmit, newClothing, handleClothesFormChange, isSuccess, message, isDisabled, mainCategories, subCategories, handleFileUpload, handleImageButtonClick, oldImage, previewImage }: FormProps) {

  const { imageBase64, contentType } = oldImage;
  const oldClothingPicture = "data:" + contentType + ";base64," + imageBase64;

  return (
    <div className="formWrapper">
      <form onSubmit={handleClothingSubmit}>

        <input
          type="file"
          id="file-upload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

      {previewImage ? 
        <img src={previewImage} alt="" className="clothingImage" />
        : oldClothingPicture &&
        <img src={oldClothingPicture} alt="" className="clothingImage" />
      }

        <Button eventHandler={handleImageButtonClick}>Upload Image</Button>
        {newClothing.filename &&
            <label className='customLabel' htmlFor='customFile'>
                {newClothing.filename}
            </label>
        }

        <InputField label="Name (optional)" name="name" menuState={newClothing.name} eventHandler={handleClothesFormChange} placeholder="Work shirt"/>

        <SelectMenu name="category" menuState={newClothing.category} inputArray={mainCategories} eventHandler={handleClothesFormChange}/>

        <SelectMenu name="subcategory" menuState={newClothing.subcategory} inputArray={subCategories} eventHandler={handleClothesFormChange}/>

        <SelectMenu name="formality" menuState={newClothing.formality} inputArray={formality} eventHandler={handleClothesFormChange}/>

        <SelectMenu name="season" menuState={newClothing.season} inputArray={seasons} eventHandler={handleClothesFormChange}/>

        <ColorPicker type="radio" menuState={newClothing.color} colorsArray={colors} eventHandler={handleClothesFormChange} />

        <InputField label="Cost" name="cost" menuState={newClothing.cost} eventHandler={handleClothesFormChange} type="number" placeholder="0"/>

        <InputField label="Worn count" name="worn_count" menuState={newClothing.worn_count} eventHandler={handleClothesFormChange} type="number" placeholder="0"/>

        <InputField label="Brand (optional)" name="brand" menuState={newClothing.brand} eventHandler={handleClothesFormChange}/>

        <Button isDisabled={isDisabled} actionType="submit" isSuccess={isSuccess}>Submit</Button>

        {message && <Message>{message}</Message>}
  
      </form>

        <BackButton/>

    </div>         
  );
}