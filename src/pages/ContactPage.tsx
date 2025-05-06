
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const navigate = useNavigate();
  
  // Simply redirect to the generic page content component
  React.useEffect(() => {
    navigate('/page/contact');
  }, [navigate]);
  
  return null;
};

export default ContactPage;
