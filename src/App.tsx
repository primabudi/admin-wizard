import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./components/ui/Layout";
import Home from './pages/Home';
import Wizard from './pages/Wizard';
import EmployeeList from './pages/EmployeeList';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/employees" element={<EmployeeList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App
