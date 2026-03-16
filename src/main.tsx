import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProductProvider>
      <OrderProvider>
        <App />
      </OrderProvider>
    </ProductProvider>
  </StrictMode>,
);
