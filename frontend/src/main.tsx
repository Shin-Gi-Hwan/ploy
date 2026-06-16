import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home     from './pages/Home'
import Intake   from './pages/Intake'
import Tracking from './pages/Tracking'
import Admin    from './pages/Admin'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<Home />}     />
        <Route path="/start"        element={<Intake />}   />
        <Route path="/track/:token" element={<Tracking />} />
        <Route path="/admin"        element={<Admin />}    />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
