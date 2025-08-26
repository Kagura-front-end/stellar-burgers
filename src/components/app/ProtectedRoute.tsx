import { Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthed = useSelector((s) => s.user.isAuth);
  return isAuthed ? <>{children}</> : <Navigate to='/login' replace />;
};
