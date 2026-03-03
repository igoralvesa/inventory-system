// Raw Material types
export interface RawMaterialCreateUpdate {
  name: string;
  stockQuantity: number;
}

export interface RawMaterial {
  id: string;
  name: string;
  stockQuantity: number;
}

// Product types
export interface ProductCreateUpdate {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

// Product Material (BOM) types
export interface ProductMaterialCreateUpdate {
  rawMaterialId: string;
  requiredQuantity: number;
}

export interface ProductMaterial {
  rawMaterialId: string;
  rawMaterialName: string;
  requiredQuantity: number;
}

// Production Suggestion types
export interface ProductionSuggestionItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface ProductionSuggestion {
  suggestedProduction: ProductionSuggestionItem[];
  totalRevenue: number;
}
