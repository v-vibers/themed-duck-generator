import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SubscribeDevProvider } from '@subscribe.dev/react'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SubscribeDevProvider projectToken={import.meta.env.VITE_SUBSCRIBE_DEV_PROJECT_TOKEN}>
      <App />
    </SubscribeDevProvider>
  </StrictMode>,
)
