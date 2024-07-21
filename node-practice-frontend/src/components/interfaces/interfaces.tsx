export interface ClothingProp { 
  _id: string;
  category: string;
  subcategory: string;
  color: string;
  formality: string;
  season: string;
  cost: number;
  worn_count: number;
  size: string;
  brand: string;
  img: string;
}

export interface FormProp {
  category: string;
  subcategory: string;
  brand: string;
  color: string;
  size: string;
  season: string;
  cost: string;
  formality: string;
  worn_count: string;
  img: string;
}