import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PetalRain from './components/PetalRain'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Sponsors from './pages/Sponsors'
import Donate from './pages/Donate'
import Gallery from './pages/Gallery'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Contact from './pages/Contact'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" toastOptions={{ style: { background: '#2d1000', color: '#FFD700', border: '1px solid #FFD70044' } }} />
        <PetalRain />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}
