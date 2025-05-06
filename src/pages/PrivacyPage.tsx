
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPage = () => {
  const navigate = useNavigate();
  
  // Simply redirect to the generic page content component
  React.useEffect(() => {
    navigate('/page/privacy');
  }, [navigate]);
  
  return null;
};

export default PrivacyPage;
