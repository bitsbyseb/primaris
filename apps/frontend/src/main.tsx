import { ContextProvider } from './components/FileContext/index.tsx';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { RouterComponent } from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ContextProvider>
        <RouterComponent />
      </ContextProvider>
    </AuthProvider>
  </StrictMode>,
)
