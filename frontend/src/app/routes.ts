import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { RawMaterialsPage } from './pages/RawMaterialsPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductionSuggestionPage } from './pages/ProductionSuggestionPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: RawMaterialsPage },
      { path: 'raw-materials', Component: RawMaterialsPage },
      { path: 'products', Component: ProductsPage },
      { path: 'production-suggestion', Component: ProductionSuggestionPage },
    ],
  },
]);
