
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the main app since we're using a single-page application
  return <Navigate to="/" replace />;
};

export default Index;
