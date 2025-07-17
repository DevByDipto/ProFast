import React from 'react'
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { useLocation } from 'react-router';

const RiderRoute = ({children}) => {
 const { user, loading } = useAuth();
 const {role,roleLoder} = useUserRole();
  const location = useLocation();
  

  if (loading || roleLoder) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user || role !== 'rider') {
    return <Navigate to="/forbiden" state={location.pathName} replace />;
  }

  return children; 
}

export default RiderRoute