import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './preview/challengeTheme.css'

import App from './App.tsx'
//import App from "./Landing.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)
