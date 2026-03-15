import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import '@fontsource/bebas-neue/400.css'
import '@fontsource/fira-sans-extra-condensed/900.css'
import '@fontsource/pt-serif/400-italic.css'
import '@fontsource/pt-serif/400.css'
import '@fontsource/pt-serif/700-italic.css'
import '@fontsource/pt-serif/700.css'

import './styles/index.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/tabs/:tabId" element={<App />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
