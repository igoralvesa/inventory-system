import { apiClient } from './client';
import type { ProductionSuggestion } from '../types';

export const suggestionApi = {
  get: () => apiClient<ProductionSuggestion>('/production/suggestion'),
};
