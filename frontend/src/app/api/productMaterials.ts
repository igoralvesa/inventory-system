import { apiClient } from './client';
import type { ProductMaterial, ProductMaterialCreateUpdate } from '../types';

export const productMaterialsApi = {
  getAll: (productId: string) =>
    apiClient<ProductMaterial[]>(`/products/${productId}/materials`),
  
  create: (productId: string, data: ProductMaterialCreateUpdate) =>
    apiClient<ProductMaterial>(`/products/${productId}/materials`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (productId: string, rawMaterialId: string, data: ProductMaterialCreateUpdate) =>
    apiClient<ProductMaterial>(`/products/${productId}/materials/${rawMaterialId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (productId: string, rawMaterialId: string) =>
    apiClient<void>(`/products/${productId}/materials/${rawMaterialId}`, {
      method: 'DELETE',
    }),
};
