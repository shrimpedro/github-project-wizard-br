
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CareersPage = () => {
  const navigate = useNavigate();
  
  // Simply redirect to the generic page content component
  React.useEffect(() => {
    navigate('/page/careers');
  }, [navigate]);
  
  return null;
};

export default CareersPage;
