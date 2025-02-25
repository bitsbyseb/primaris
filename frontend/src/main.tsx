import { ContextProvider } from './components/FileContext/index.tsx';
import App from './components/App/index.tsx'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css';
createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>,
)
