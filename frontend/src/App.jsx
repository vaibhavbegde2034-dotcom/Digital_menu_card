import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';

// Lazy load components
const Menu = lazy(() => import('./components/Customer/Menu'));
const MenuDirectory = lazy(() => import('./components/Customer/MenuDirectory'));
const Login = lazy(() => import('./components/Admin/Login'));
const Register = lazy(() => import('./components/Admin/Register'));
const Dashboard = lazy(() => import('./components/Admin/Dashboard'));
const FoodManage = lazy(() => import('./components/Admin/FoodManage'));
const CategoryManage = lazy(() => import('./components/Admin/CategoryManage'));

const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loader"></div>
  </div>
);

const AppLayout = () => {
  const location = useLocation();
  const publicPaths = ['/', '/admin', '/admin/register'];
  const showNavbar = !publicPaths.includes(location.pathname) && !location.pathname.startsWith('/menu/');

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="container">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/menus" element={<MenuDirectory />} />
            <Route path="/menu/:adminId" element={<Menu />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/foods" element={<FoodManage />} />
            <Route path="/admin/categories" element={<CategoryManage />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
