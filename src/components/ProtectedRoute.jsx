import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  console.log('Auth check:', { hasToken: !!token, hasUser: !!user }); // Debug log

  if (!token || !user) {
    console.log('No auth data found, redirecting to login'); // Debug log
    return <Navigate to="/login" state={{ from: location }} />;
  }

  try {
    // Verify user data is valid JSON
    JSON.parse(user);
    return children;
  } catch (error) {
    console.error('Invalid user data, redirecting to login:', error); // Debug log
    localStorage.clear(); // Clear all storage on error
    return <Navigate to="/login" state={{ from: location }} />;
  }
};

export default ProtectedRoute;
