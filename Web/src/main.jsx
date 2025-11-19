import { Provider } from "@/components/ui/provider"
import { AuthProvider } from "./context/AuthContext";
import { StrictMode } from 'react'
import { SnackbarProvider } from 'notistack';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={3000}>
        <App />
        </SnackbarProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
)