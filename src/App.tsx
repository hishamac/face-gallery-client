import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Gallery from './components/Gallery';
import PersonDetail from './components/PersonDetail';
import ImageDetail from './components/ImageDetail';
import Admin from './components/Admin';
import Persons from './components/Persons';
import Albums from './components/Albums';
import Sections from './components/Sections';

function App() {
  return (
    <>
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
            <AdminLayout>
              <Admin />
            </AdminLayout>
          } />
          
          {/* Admin Album, Section, and Person Pages with Admin Layout */}
          <Route path="/admin/albums" element={
            <AdminLayout>
              <Albums />
            </AdminLayout>
          } />
          <Route path="/admin/sections" element={
            <AdminLayout>
              <Sections />
            </AdminLayout>
          } />
          <Route path="/admin/persons" element={
            <AdminLayout>
              <Persons />
            </AdminLayout>
          } />
          <Route path="/admin/person/:personId" element={
            <AdminLayout>
              <PersonDetail />
            </AdminLayout>
          } />
          <Route path="/admin/images" element={
            <AdminLayout>
              <Gallery />
            </AdminLayout>
          } />
          <Route path="/admin/image/:imageId" element={
            <AdminLayout>
              <ImageDetail />
            </AdminLayout>
          } />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;