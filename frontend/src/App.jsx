import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Menu from './components/Customer/Menu';
import MenuDirectory from './components/Customer/MenuDirectory';
import Login from './components/Admin/Login';
import Register from './components/Admin/Register';
import Dashboard from './components/Admin/Dashboard';
import FoodManage from './components/Admin/FoodManage';
import CategoryManage from './components/Admin/CategoryManage';
import SuperAdminDashboard from './components/Admin/SuperAdminDashboard';
import Navbar from './components/Navbar';
import './index.css';

const AppLayout = () => {
  const location = useLocation();
  const publicPaths = ['/', '/admin', '/admin/register'];
  const showNavbar = !publicPaths.includes(location.pathname) && !location.pathname.startsWith('/menu/');

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menus" element={<MenuDirectory />} />
          <Route path="/menu/:adminId" element={<Menu />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/foods" element={<FoodManage />} />
          <Route path="/admin/categories" element={<CategoryManage />} />
          <Route path="/admin/super-dashboard" element={<SuperAdminDashboard />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AdminProvider>
      <Router>
        <AppLayout />
      </Router>
    </AdminProvider>
  );
}

export default App;
