import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Gallery from './components/Gallery';
import PersonDetail from './components/PersonDetail';
import ImageDetail from './components/ImageDetail';
import Admin from './components/Admin';
import Persons from './components/Persons';

function App() {
  return (
    <Router>
      <Routes>
        {/* User Pages with User Layout */}
        <Route path="/" element={
          <Layout>
            <Gallery />
          </Layout>
        } />
        <Route path="/persons" element={
          <Layout>
            <Persons />
          </Layout>
        } />
        <Route path="/person/:personId" element={
          <Layout>
            <PersonDetail />
          </Layout>
        } />
        <Route path="/image/:imageId" element={
          <Layout>
            <ImageDetail />
          </Layout>
        } />
        
        {/* Admin Pages with Admin Layout */}
        <Route path="/admin" element={
          <Layout>
            <Admin />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;