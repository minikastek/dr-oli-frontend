import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <WhatsAppFloat />
    </BrowserRouter>
  )
}
