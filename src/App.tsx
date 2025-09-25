import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gallery from './components/Gallery';
import PersonDetail from './components/PersonDetail';
import ImageDetail from './components/ImageDetail';
import Admin from './components/Admin';
import Persons from './components/Persons';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/persons" element={<Persons />} />
          <Route path="/person/:personId" element={<PersonDetail />} />
          <Route path="/image/:imageId" element={<ImageDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;