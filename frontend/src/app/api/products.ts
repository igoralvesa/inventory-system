import { apiClient } from './client';
import type { Product, ProductCreateUpdate } from '../types';

export const productsApi = {
  getAll: () => apiClient<Product[]>('/products'),
  
  getById: (id: string) => apiClient<Product>(`/products/${id}`),
  
  create: (data: ProductCreateUpdate) =>
    apiClient<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: ProductCreateUpdate) =>
    apiClient<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiClient<void>(`/products/${id}`, {
      method: 'DELETE',
    }),
};
