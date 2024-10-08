import { clothingCategories } from "dummyData/subcategoryArray";

export interface ClothingProp { 
  _id: string;
  user_id?: string;
  category: string;
  subcategory: string;
  color: string;
  formality: string;
  season: string;
  cost: number;
  worn_count: number;

  name?: string;
  brand?: string;

  filename?: string;
  imageBase64?: string;
  contentType?: string;
}

export interface OutfitProp {
  _id: string;
  user_id?: string;
  clothes: ClothingProp[];
  formality?: string;
  season?: string;
  color?: string[];
  
  name?: string;
}

export interface FormProp {
  category: keyof typeof clothingCategories;
  subcategory: string;
  color: string;
  season: string;
  cost: string;
  formality: string;
  worn_count: string;

  name: string;
  brand: string;
}

export interface UserFormProp {
  name?: string;
  email: string;
  password: string;
}

export interface CustomError {
  response: {
    data: {
      message?: string;
      error?: string;
    };
  };
}