import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

function ConditionalFooter() {
  const location = useLocation();
  const hideFooterRoutes = ["/login", "/introducingworkshop"];

  return hideFooterRoutes.includes(location.pathname) ? null : <Footer />;
}

export default ConditionalFooter;
