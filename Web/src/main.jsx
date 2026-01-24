import { Provider } from "@/components/ui/provider"
import { ColorModeProvider } from "./components/ui/color-mode"
import { AuthProvider } from "./context/AuthContext";
import { StrictMode } from 'react'
import { SnackbarProvider } from 'notistack';
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <ColorModeProvider>
        <AuthProvider>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={3000}>
          <App />
          </SnackbarProvider>
        </AuthProvider>
      </ColorModeProvider>
    </Provider>
  </StrictMode>
)