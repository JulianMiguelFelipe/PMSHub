import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthCallbackPage from './pages/AuthCallbackPage'; // You'll create this next

// Placeholder components for the "vibe"
const Page = ({ name }) => <div className="p-10 text-2xl font-bold">{name} Page</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Page name="Login" />} />
        <Route path="/register" element={<Page name="Register" />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected Routes (Sprint 2 & 3) */}
        <Route path="/products" element={<Page name="Product List" />} />
        <Route path="/deleted-items" element={<Page name="Deleted Items (Admin Only)" />} />
        <Route path="/admin" element={<Page name="User Management (SuperAdmin Only)" />} />
        
        {/* Redirect unknown to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;