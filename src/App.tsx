import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./components/ui/Layout";
import { Toaster } from "./components/ui/toaster";
import Wizard from './pages/Wizard';
import EmployeeList from './pages/EmployeeList';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App
