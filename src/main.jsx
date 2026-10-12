import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ProjectProvider } from './contexts/ProjectContext.jsx'
import { CardProvider } from './contexts/CardContext.jsx'
import { ConfirmProvider } from './contexts/ConfirmContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ConfirmProvider>
        <ProjectProvider>
          <CardProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CardProvider>
        </ProjectProvider>
      </ConfirmProvider>
    </AuthProvider>
  </StrictMode>,
)
