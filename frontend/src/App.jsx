import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SharedDownload from './pages/SharedDownload'; 

// 1. Create a "Guard" Component
// This checks for the token LIVE every time you try to visit the route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

// 2. Create a "Public" Guard
// If you are already logged in, you shouldn't see the Login page
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES (Login/Register) */}
        {/* If logged in, these redirect you to Dashboard */}
        <Route path="/signin" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute><Register /></PublicRoute>
        } />
        
        {/* PROTECTED ROUTE (Dashboard) */}
        {/* If logged out, this redirects you to Signin */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        
        {/* PUBLIC SHARE LINK (Always accessible) */}
        <Route path="/s/:hash" element={<SharedDownload />} />

        {/* REDIRECTS for old paths */}
        <Route path="/login" element={<Navigate to="/signin" />} />
        <Route path="/register" element={<Navigate to="/signup" />} />

        {/* DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;