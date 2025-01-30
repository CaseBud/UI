import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  console.log('ProtectedRoute - Auth status:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Rendering protected content');
  return children;
};

export default ProtectedRoute;
