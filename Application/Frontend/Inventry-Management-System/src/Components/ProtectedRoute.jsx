import { Navigate } from 'react-router-dom';
import { useAuth } from '../Hook/useAuth.jsx';

export default function ProtectedRoute({ children, requiredRole = null }) {
    const { isLoggedIn, userRole } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/signin" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}
