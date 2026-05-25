import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PhotographyProvider } from './context/PhotographyContext';
import Landing from './pages/Landing';
import SelectMethod from './pages/SelectMethod';
import Studio from './pages/Studio';
import SelectFrame from './pages/SelectFrame';
import Result from './pages/Result';
import Recap from './pages/Recap';
import './App.css';

function App() {
  return (
    <PhotographyProvider>
      <Router>
        <div className="bg-silk min-h-screen text-wood selection:bg-cashmere selection:text-wood">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/select-method" element={<SelectMethod />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/select-frame" element={<SelectFrame />} />
            <Route path="/result" element={<Result />} />
            <Route path="/recap" element={<Recap />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Decorative Corner Elements - hidden on mobile */}
          <div className="hidden md:block fixed top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-wood/5 m-8 pointer-events-none" />
          <div className="hidden md:block fixed bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-wood/5 m-8 pointer-events-none" />
        </div>
      </Router>
    </PhotographyProvider>
  );
}

export default App;
