import { apiClient } from './client';
import type { RawMaterial, RawMaterialCreateUpdate } from '../types';

export const rawMaterialsApi = {
  getAll: () => apiClient<RawMaterial[]>('/raw-materials'),
  
  getById: (id: string) => apiClient<RawMaterial>(`/raw-materials/${id}`),
  
  create: (data: RawMaterialCreateUpdate) =>
    apiClient<RawMaterial>('/raw-materials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: RawMaterialCreateUpdate) =>
    apiClient<RawMaterial>(`/raw-materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiClient<void>(`/raw-materials/${id}`, {
      method: 'DELETE',
    }),
};
