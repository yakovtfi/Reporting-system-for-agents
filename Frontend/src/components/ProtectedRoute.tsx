import React from 'react';
import { Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps{
    children: React.ReactElement;
    roles: Array<"admin" | "agent">
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, roles}) => {
    const {user, loading} = useAuth();

    if(loading){
        return <div className='page'>Loading..</div>
    }

    if(!user){
        return <Navigate to="/login" replace />
    }

    if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children
}

export default ProtectedRoute
