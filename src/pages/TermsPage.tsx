
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();
  
  // Simply redirect to the generic page content component
  React.useEffect(() => {
    navigate('/page/terms');
  }, [navigate]);
  
  return null;
};

export default TermsPage;
